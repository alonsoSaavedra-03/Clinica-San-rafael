<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Middleware para autorización granular basada en roles:
 * 'paciente', 'medico', 'administrador'.
 */
class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Acceso denegado: No cuenta con los privilegios requeridos para este recurso.'
            ], 403);
        }

        return $next($request);
    }
}
