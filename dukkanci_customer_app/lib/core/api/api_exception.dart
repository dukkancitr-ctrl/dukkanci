class ApiException implements Exception {
  final int? statusCode;
  final String message;
  final String? code;

  const ApiException({this.statusCode, required this.message, this.code});

  @override
  String toString() => 'ApiException($statusCode, $code): $message';
}
