import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_recognition_error.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import '../localization/app_strings.dart';
import '../theme/app_colors.dart';

/// On-device speech recognition (Android's SpeechRecognizer via the
/// speech_to_text plugin — same "no audio stored, ask the OS" approach as
/// the website's Web Speech API voice search). Mic permission is requested
/// only on the first tap, never at screen load, matching this app's
/// explicit-action permission policy (see AndroidManifest.xml).
///
/// Deliberately does NOT pre-check `SpeechToText.locales()` before
/// listening: on Android 13+ that call reports only *downloaded on-device*
/// language packs (`checkRecognitionSupport().supportedOnDeviceLanguages`),
/// not overall recognition ability — real-phone testing showed it reports
/// zero Arabic entries on stock phones that recognize Arabic fine via the
/// normal online path (nobody manually downloads the offline pack), which
/// made the button falsely claim "unavailable" on working hardware. Instead
/// this just attempts `listen(localeId: 'ar')` directly (same as the
/// website's `lang='ar'`) and only shows an honest failure message if the
/// listen attempt itself actually errors.
class VoiceSearchButton extends StatefulWidget {
  const VoiceSearchButton({super.key, required this.onResult});

  final ValueChanged<String> onResult;

  @override
  State<VoiceSearchButton> createState() => _VoiceSearchButtonState();
}

class _VoiceSearchButtonState extends State<VoiceSearchButton> {
  final _speech = stt.SpeechToText();
  bool _speechEnabled = false;
  bool _listening = false;

  @override
  void dispose() {
    if (_listening) _speech.stop();
    super.dispose();
  }

  void _showMessage(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message), duration: const Duration(seconds: 3)));
  }

  void _handleListenError(SpeechRecognitionError error) {
    if (!mounted) return;
    setState(() => _listening = false);
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    switch (error.errorMsg) {
      case 'error_no_match':
      case 'error_speech_timeout':
        _showMessage(AppStrings.voiceSearchNoSpeechDetected);
      case 'error_language_not_supported':
      case 'error_language_unavailable':
        _showMessage(AppStrings.voiceSearchUnavailable);
      default:
        _showMessage(AppStrings.somethingWentWrong);
    }
  }

  Future<void> _stopListening() async {
    await _speech.stop();
    if (!mounted) return;
    setState(() => _listening = false);
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
  }

  Future<void> _startListening() async {
    if (!_speechEnabled) {
      final available = await _speech.initialize(
        onStatus: (status) {
          if ((status == 'done' || status == 'notListening') && mounted) {
            setState(() => _listening = false);
          }
        },
        onError: _handleListenError,
      );
      if (!mounted) return;
      if (!available) {
        _showMessage(AppStrings.voiceSearchNoPermission);
        return;
      }
      _speechEnabled = true;
    }

    setState(() => _listening = true);
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(AppStrings.voiceSearchListening), duration: const Duration(seconds: 15)));

    await _speech.listen(
      listenOptions: stt.SpeechListenOptions(
        localeId: 'ar',
        listenFor: Duration(seconds: 15),
        pauseFor: Duration(seconds: 3),
      ),
      onResult: (result) {
        if (!result.finalResult) return;
        final text = result.recognizedWords.trim();
        if (mounted) setState(() => _listening = false);
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
        if (text.isEmpty) {
          _showMessage(AppStrings.voiceSearchNoSpeechDetected);
        } else {
          widget.onResult(text);
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      tooltip: AppStrings.voiceSearchListening,
      icon: AnimatedSwitcher(
        duration: const Duration(milliseconds: 150),
        child: _listening
            ? const Icon(Icons.mic_rounded, key: ValueKey('on'), color: AppColors.green800)
            : const Icon(Icons.mic_none_rounded, key: ValueKey('off'), color: AppColors.muted),
      ),
      onPressed: _listening ? _stopListening : _startListening,
    );
  }
}
