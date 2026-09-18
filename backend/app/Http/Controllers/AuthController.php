<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * Controlador de Autenticación con Laravel Sanctum.
 * Gestiona registro de pacientes, login seguro, obtención de usuario en sesión y logout.
 */
class AuthController extends Controller
{
    /**
     * Registro de nuevo paciente.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'       => 'required|string|max:120',
            'email'      => 'required|email|max:150|unique:users,email',
            'password'   => 'required|string|min:8|confirmed',
            'dni'        => 'required|string|digits:8|unique:users,dni',
            'phone'      => 'required|string|min:9|max:15',
            'birth_date' => 'nullable|date',
            'address'    => 'nullable|string|max:200',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Errores de validación en el formulario.',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => 'paciente', // Registro público siempre como paciente
            'dni'        => $request->dni,
            'phone'      => $request->phone,
            'birth_date' => $request->birth_date,
            'address'    => $request->address,
        ]);

        $token = $user->createToken('salud_rapida_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Cuenta registrada exitosamente en Salud Rápida S.A.',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    /**
     * Inicio de sesión para pacientes, médicos o administradores.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Por favor verifique las credenciales ingresadas.',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'El correo electrónico o la contraseña son incorrectos.'
            ], 401);
        }

        // Cargar relación de médico si corresponde
        if ($user->role === 'medico') {
            $user->load(['doctorProfile.specialty']);
        }

        $token = $user->createToken('salud_rapida_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Bienvenido(a) a Salud Rápida S.A.',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    /**
     * Obtener el perfil del usuario autenticado.
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'medico') {
            $user->load(['doctorProfile.specialty']);
        }

        return response()->json([
            'success' => true,
            'user'    => $user
        ]);
    }

    /**
     * Cierre de sesión y revocación del token activo.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sesión finalizada correctamente.'
        ]);
    }
}
