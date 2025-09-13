<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServerRequest;
use App\Http\Requests\UpdateServerRequest;
use App\Http\Resources\ServerResource;
use App\Models\Server;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException; 

class ServerController extends Controller {

    public function index(Request $request) {
        try {
            $query = Server::query();
            if ($q = $request->query('q')) {
                $query->where(function($sub) use ($q) {
                    $sub->where('name','like',"%{$q}%")
                        ->orWhere('ip_address','like',"%{$q}%");
                });
            }
            if ($provider = $request->query('provider')) $query->where('provider',$provider);
            if ($status = $request->query('status')) $query->where('status',$status);
            if ($minCpu = $request->query('min_cpu')) $query->where('cpu_cores','>=',(int)$minCpu);
            if ($maxCpu = $request->query('max_cpu')) $query->where('cpu_cores','<=',(int)$maxCpu);
            $sort = $request->query('sort','id');
            $order = $request->query('order','desc');
            $allowed = ['id','name','ip_address','cpu_cores','ram_mb','storage_gb','created_at','updated_at'];
            if (!in_array($sort, $allowed)) $sort = 'id';
            $order = strtolower($order) === 'asc' ? 'asc' : 'desc';
            $query->orderBy($sort, $order);
            $perPage = (int)$request->query('per_page', 15);
            $perPage = min(100, max(1, $perPage));
            $res = $query->paginate($perPage)->appends($request->query());

            return ServerResource::collection($res)
                ->additional(['message' => 'Servers fetched successfully'])
                ->response()
                ->setStatusCode(200);
        }
        catch (QueryException $e) {
            return response()->json([
                'error' => 'database_error',
                'message' => 'Database query failed'
            ], 500);
        }
        catch (\Exception $e) {
            return response()->json([
                'error' => 'server_error',
                'message' => 'Something went wrong'
            ], 500);
        }
    }

    public function store(StoreServerRequest $request) {
        $data = $request->validated();
        try {
            $server = DB::transaction(function() use ($data) {
                return Server::create($data);
            });
            return (new ServerResource($server))
                ->additional(['message' => 'Server created successfully'])
                ->response()
                ->setStatusCode(200);
        }
        catch (QueryException $e) {
            if (($e->errorInfo[1] ?? 0) === 1062) {
                return response()->json([
                    'error' => 'database_error',
                    'message' => 'Possible duplicate ip or name per provider.'
                ], 409);
            }
            return response()->json([
                'error' => 'server_error',
                'message' => 'Database query failed'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'server_error',
                'message' => 'Something went wrong',
            ], 500);
        }
    }

    public function show(Server $server) {
        return new ServerResource($server);
    }

    public function update(UpdateServerRequest $request, Server $server) {
        $data = $request->validated();

        if (isset($data['version'])) {
            if ((int)$data['version'] !== (int)$server->version) {
                return response()->json([
                    'error' => 'version_mismatch',
                    'message' => 'Resource version mismatch. Refresh and try again.'
                ], 409);
            }
        }

        try {
            $updated = DB::transaction(function() use ($server, $data) {
                if (array_key_exists('version', $data)) {
                    $data['version'] = $server->version + 1;
                } else {
                    $data['version'] = $server->version + 1;
                }
                $server->update($data);
                return $server->fresh();
            });

            return (new ServerResource($updated))
                ->additional(['message' => 'Server updated successfully'])
                ->response()
                ->setStatusCode(200);

        } catch (QueryException $e) {
            return response()->json(['error'=>'database_error','message'=>$e->getMessage()], 409);
        }
        catch (\Exception $e) {
            return response()->json(['error'=>'server_error','message'=>'Something went wrong'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $server = Server::findOrFail($id);
            $server->delete();

            return response()->json([
                'message' => 'Server deleted successfully'
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'not_found',
                'message' => 'Server not found'
            ], 404);

        } catch (QueryException $e) {
            return response()->json([
                'error' => 'database_error',
                'message' => 'Cannot delete server due to related records'
            ], 409);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'server_error',
                'message' => 'Something went wrong'
            ], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        $ids = (array)$request->input('ids', []);

        if (empty($ids)) {
            return response()->json([
                'error' => 'invalid_request',
                'message' => 'ids required'
            ], 400);
        }

        $existingIds = Server::whereIn('id', $ids)->pluck('id')->toArray();
        $notFound = array_diff($ids, $existingIds);
        if (!empty($notFound)) {
            return response()->json([
                'error' => 'not_found',
                'message' => count($notFound) . ' servers not found',
                'ids' => array_values($notFound)
            ], 404);
        }

        try {
            $deleted = Server::whereIn('id', $existingIds)->delete();

            return response()->json([
                'message' => "$deleted servers deleted successfully",
                'deleted_count' => $deleted
            ], 200);

        } catch (QueryException $e) {
            return response()->json([
                'error' => 'database_error',
                'message' => 'Cannot delete some servers due to related records'
            ], 409);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'server_error',
                'message' => 'Something went wrong'
            ], 500);
        }
    }

}
