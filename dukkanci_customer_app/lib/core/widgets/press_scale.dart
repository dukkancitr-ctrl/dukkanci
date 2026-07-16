import 'package:flutter/material.dart';

/// Subtle press-down feedback for tappable cards (ui-ux-pro-max:
/// scale-feedback — 0.95-1.05 scale on press, restore on release). Wrap any
/// card/tile that responds to a tap in this instead of a bare InkWell so
/// every tappable surface in the app feels the same.
class PressScale extends StatefulWidget {
  const PressScale({super.key, required this.onTap, required this.child, this.borderRadius});

  final VoidCallback? onTap;
  final Widget child;
  final BorderRadius? borderRadius;

  @override
  State<PressScale> createState() => _PressScaleState();
}

class _PressScaleState extends State<PressScale> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      onTapDown: widget.onTap == null ? null : (_) => setState(() => _pressed = true),
      onTapUp: widget.onTap == null ? null : (_) => setState(() => _pressed = false),
      onTapCancel: widget.onTap == null ? null : () => setState(() => _pressed = false),
      child: AnimatedScale(
        scale: _pressed ? 0.97 : 1,
        duration: const Duration(milliseconds: 120),
        curve: Curves.easeOut,
        child: widget.child,
      ),
    );
  }
}
