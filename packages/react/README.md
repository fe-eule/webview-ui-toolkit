# @web-ui-toolkit/react

- Components
- Hooks
  - [useDeviceOrientation](https://github.com/doong-jo/web-ui-toolkit#useDeviceOrientation)

---

## useDeviceOrientation

### What is it?

<img src="https://user-images.githubusercontent.com/22005861/123515869-3d9c5b00-d6d4-11eb-8404-b1d148e7f365.gif" width="300" height="640" />

Implementing the specifications below with React Hook

- [W3C](https://www.w3.org/TR/orientation-event/)
- [Google Developers](https://developers.google.com/web/fundamentals/native-hardware/device-orientation)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientation_event)


### Usage

📌  [Device Orientation Event works only in HTTPS for security reasons.](https://w3c.github.io/deviceorientation/#security-and-privacy)

```sh
npm i react-device-orientation-hook
```

```typescript
import { useDeviceOrientation } from '@web-ui-toolkit/react';

function Component() {
  const { transformStyle, resetPivotOrientation } = useDeviceOrientation();

  return (
    <>
      <div style={transformStyle} onClick={resetPivotOrientation} >
        Hello World!
      </div>
      <p>Touch text and Revise orientation</p>
    </>
  );
}
```
