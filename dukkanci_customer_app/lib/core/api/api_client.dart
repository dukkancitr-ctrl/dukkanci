import 'package:dio/dio.dart';
import 'package:uuid/uuid.dart';
import '../cache/secure_storage.dart';
import '../config/app_config.dart';
import 'api_exception.dart';

/// Thin Dio wrapper around the existing action-style backend
/// (`/api/notify-order?action=...`, `/api/dalil`, etc — see api/ in the
/// website repo). See supabase_bootstrap.dart for why this app does NOT
/// assume a clean `/api/v1/...` REST surface exists yet.
class ApiClient {
  ApiClient(this._secureStorage) : _dio = Dio(
          BaseOptions(
            baseUrl: AppConfig.apiBaseUrl,
            connectTimeout: const Duration(seconds: 12),
            receiveTimeout: const Duration(seconds: 20),
            headers: {'Accept': 'application/json'},
          ),
        ) {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _secureStorage.accessToken;
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) {
          handler.next(error);
        },
      ),
    );
  }

  final Dio _dio;
  final SecureStorage _secureStorage;
  final _uuid = const Uuid();

  /// Generates a fresh Idempotency-Key for one order submission attempt.
  /// The checkout screen must reuse the SAME key across retries of the
  /// SAME user tap (e.g. after a timeout) so a flaky connection can't create
  /// two orders — see spec section 16, "منع الطلبات المكررة".
  String newIdempotencyKey() => _uuid.v4();

  Future<T> post<T>(
    String path, {
    Map<String, dynamic>? data,
    String? idempotencyKey,
    T Function(dynamic json)? parse,
  }) async {
    try {
      final res = await _dio.post(
        path,
        data: data,
        options: Options(
          headers: idempotencyKey != null ? {'Idempotency-Key': idempotencyKey} : null,
        ),
      );
      return parse != null ? parse(res.data) : res.data as T;
    } on DioException catch (e) {
      throw _toApiException(e);
    }
  }

  Future<T> get<T>(String path, {Map<String, dynamic>? query, T Function(dynamic json)? parse}) async {
    try {
      final res = await _dio.get(path, queryParameters: query);
      return parse != null ? parse(res.data) : res.data as T;
    } on DioException catch (e) {
      throw _toApiException(e);
    }
  }

  ApiException _toApiException(DioException e) {
    final status = e.response?.statusCode;
    final body = e.response?.data;
    final serverMessage = (body is Map) ? body['message'] as String? : null;
    final serverCode = (body is Map) ? (body['errors']?['code'] as String?) : null;
    if (e.type == DioExceptionType.connectionTimeout || e.type == DioExceptionType.receiveTimeout) {
      return const ApiException(message: 'انتهت مهلة الاتصال، حاول مرة أخرى', code: 'TIMEOUT');
    }
    if (status == 401 || status == 403) {
      return ApiException(statusCode: status, message: serverMessage ?? 'انتهت صلاحية الجلسة', code: serverCode ?? 'UNAUTHORIZED');
    }
    return ApiException(statusCode: status, message: serverMessage ?? 'حدث خطأ ما، حاول مرة أخرى', code: serverCode);
  }
}
