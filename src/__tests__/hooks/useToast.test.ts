import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useToast } from '@/hooks/useToast';

describe('useToast', () => {
  describe('initialization', () => {
    it('should initialize with hidden state', () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.toastState.visible).toBe(false);
      expect(result.current.toastState.message).toBe('');
      expect(result.current.toastState.type).toBe('info');
    });
  });

  describe('showToast', () => {
    it('should show toast with message', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('Test message');
      });

      expect(result.current.toastState.visible).toBe(true);
      expect(result.current.toastState.message).toBe('Test message');
      expect(result.current.toastState.type).toBe('info');
    });

    it('should show error toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('Error occurred', 'error');
      });

      expect(result.current.toastState.visible).toBe(true);
      expect(result.current.toastState.message).toBe('Error occurred');
      expect(result.current.toastState.type).toBe('error');
    });

    it('should show success toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('Success!', 'success');
      });

      expect(result.current.toastState.type).toBe('success');
    });

    it('should show warning toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('Warning!', 'warning');
      });

      expect(result.current.toastState.type).toBe('warning');
    });

    it('should update message when called multiple times', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('First message');
      });

      expect(result.current.toastState.message).toBe('First message');

      act(() => {
        result.current.showToast('Second message', 'error');
      });

      expect(result.current.toastState.message).toBe('Second message');
      expect(result.current.toastState.type).toBe('error');
    });

    it('should maintain showToast reference stability', () => {
      const { result, rerender } = renderHook(() => useToast());
      const firstShow = result.current.showToast;

      rerender();

      expect(result.current.showToast).toBe(firstShow);
    });
  });

  describe('hideToast', () => {
    it('should hide toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('Test message');
      });

      expect(result.current.toastState.visible).toBe(true);

      act(() => {
        result.current.hideToast();
      });

      expect(result.current.toastState.visible).toBe(false);
    });

    it('should preserve message and type when hiding', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('Test message', 'error');
      });

      act(() => {
        result.current.hideToast();
      });

      expect(result.current.toastState.visible).toBe(false);
      expect(result.current.toastState.message).toBe('Test message');
      expect(result.current.toastState.type).toBe('error');
    });

    it('should maintain hideToast reference stability', () => {
      const { result, rerender } = renderHook(() => useToast());
      const firstHide = result.current.hideToast;

      rerender();

      expect(result.current.hideToast).toBe(firstHide);
    });
  });

  describe('typical usage workflow', () => {
    it('should handle complete toast lifecycle', () => {
      const { result } = renderHook(() => useToast());

      // Initially hidden
      expect(result.current.toastState.visible).toBe(false);

      // Show error
      act(() => {
        result.current.showToast('Upload failed', 'error');
      });

      expect(result.current.toastState.visible).toBe(true);
      expect(result.current.toastState.message).toBe('Upload failed');
      expect(result.current.toastState.type).toBe('error');

      // Hide toast
      act(() => {
        result.current.hideToast();
      });

      expect(result.current.toastState.visible).toBe(false);

      // Show success
      act(() => {
        result.current.showToast('Upload successful!', 'success');
      });

      expect(result.current.toastState.visible).toBe(true);
      expect(result.current.toastState.message).toBe('Upload successful!');
      expect(result.current.toastState.type).toBe('success');
    });
  });

  describe('edge cases', () => {
    it('should handle empty message', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('');
      });

      expect(result.current.toastState.visible).toBe(true);
      expect(result.current.toastState.message).toBe('');
    });

    it('should handle very long message', () => {
      const { result } = renderHook(() => useToast());
      const longMessage = 'A'.repeat(1000);

      act(() => {
        result.current.showToast(longMessage);
      });

      expect(result.current.toastState.message).toBe(longMessage);
    });

    it('should handle rapid show/hide calls', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast('Message 1');
        result.current.hideToast();
        result.current.showToast('Message 2');
        result.current.hideToast();
        result.current.showToast('Message 3');
      });

      expect(result.current.toastState.visible).toBe(true);
      expect(result.current.toastState.message).toBe('Message 3');
    });

    it('should handle hideToast when already hidden', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.hideToast();
        result.current.hideToast();
      });

      expect(result.current.toastState.visible).toBe(false);
    });
  });

  describe('toast types', () => {
    const types: Array<'success' | 'error' | 'warning' | 'info'> = [
      'success',
      'error',
      'warning',
      'info',
    ];

    types.forEach((type) => {
      it(`should handle ${type} toast type`, () => {
        const { result } = renderHook(() => useToast());

        act(() => {
          result.current.showToast(`${type} message`, type);
        });

        expect(result.current.toastState.type).toBe(type);
        expect(result.current.toastState.visible).toBe(true);
      });
    });
  });
});
