import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import '../localization/app_strings.dart';
import '../theme/app_colors.dart';

/// On-device speech recognition (Android's SpeechRecognizer via the
/// speech_to_text plugin — same "no audio stored, ask the OS" approach as
/// the website's Web Speech API voice search). Mic permission is requested
/// only on the first tap, never at screen load, matching this app's
/// explicit-action permission policy (see AndroidManifest.xml).
///
/// There is no cheap way to check "does this device support Arabic speech
/// recognition" without first calling `initialize()` (which itself triggers
/// the permission prompt on Android) — so unlike the website, which can hide
/// the mic icon upfront via `window.SpeechRecognition`, this button always
/// shows and instead fails closed with an honest message on tap if the
/// device, permission, or an Arabic locale isn't available.
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

  stt.LocaleName? _findArabicLocale(List<stt.LocaleName> locales) {
    for (final locale in locales) {
      if (locale.localeId.toLowerCase().startsWith('ar')) return locale;
    }
    return null;
  }

  void _showMessage(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message), duration: const Duration(seconds: 3)));
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
        onError: (_) {
          if (mounted) setState(() => _listening = false);
        },
      );
      if (!mounted) return;
      if (!available) {
        _showMessage(AppStrings.voiceSearchNoPermission);
        return;
      }
      _speechEnabled = true;
    }

    final arabicLocale = _findArabicLocale(await _speech.locales());
    if (!mounted) return;
    if (arabicLocale == null) {
      _showMessage(AppStrings.voiceSearchUnavailable);
      return;
    }

    setState(() => _listening = true);
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(AppStrings.voiceSearchListening), duration: const Duration(seconds: 15)));

    await _speech.listen(
      listenOptions: stt.SpeechListenOptions(
        localeId: arabicLocale.localeId,
        listenFor: const Duration(seconds: 15),
        pauseFor: const Duration(seconds: 3),
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
