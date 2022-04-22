import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

export enum RotateDirection {
  NONE = 'NONE',
  REVERSE = 'REVERSE',
}

export interface DeviceRotationRate {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

export class DeviceOrientationOptionProcess {
  private orientation: DeviceRotationRate;
  private transformStyle: CSSProperties;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    this.orientation = { alpha: null, beta: null, gamma: null };
    this.transformStyle = { transform: '' };
  }

  setData(orientation: DeviceRotationRate) {
    this.orientation = orientation;
    this.transformStyle = { transform: '' };

    return this;
  }

  adjustByCorrection(enable: boolean, initialData: DeviceRotationRate) {
    if (!enable) {
      return this;
    }

    this.orientation = {
      alpha: (this.orientation.alpha || 0) - (initialData.alpha || 0),
      beta: (this.orientation.beta || 0) - (initialData.beta || 0),
      gamma: (this.orientation.gamma || 0) - (initialData.gamma || 0),
    };

    this.transformStyle = {
      transform: `rotateX(${this.orientation.beta}deg) rotateY(${this.orientation.gamma}deg) rotateZ(${this.orientation.alpha}deg)`,
    };

    return this;
  }

  adjustDirection(transformDirections: [RotateDirection, RotateDirection, RotateDirection]) {
    const [directionX, directionY, directionZ] = transformDirections;
    function getDirectionValue(degree: number, direction: RotateDirection): number {
      if (direction === RotateDirection.NONE) {
        return degree;
      }

      return degree * -1;
    }

    this.transformStyle = {
      transform: `rotateX(${getDirectionValue(
        this.orientation.beta || 0,
        directionX
      )}deg) rotateY(${getDirectionValue(
        this.orientation.gamma || 0,
        directionY
      )}deg) rotateZ(${getDirectionValue(this.orientation.alpha || 0, directionZ)}deg)`,
    };

    return this;
  }

  commit() {
    return {
      orientation: this.orientation,
      transformStyle: this.transformStyle,
    };
  }
}

export const processDeviceOrientationOption = new DeviceOrientationOptionProcess();

export interface DeviceOrientationHookOptions {
  enableInitialOrientation?: boolean;
  rotateXDirection?: RotateDirection;
  rotateYDirection?: RotateDirection;
  rotateZDirection?: RotateDirection;
}

const defaultDeviceOrientation = {
  gamma: 0,
  beta: 0,
  alpha: 0,
};

const defaultDeviceOrientationHookOptions: DeviceOrientationHookOptions = {
  enableInitialOrientation: true,
  rotateXDirection: RotateDirection.NONE,
  rotateYDirection: RotateDirection.REVERSE,
  rotateZDirection: RotateDirection.REVERSE,
};

/**
 *
 * @param options DeviceOrientationHookOptions
 *
 * enableInitialOrientation (default: true): Adjust the orientation based on when the component is first mounted.
 *
 * rotateXDirection (default: NONE): X Correct the direction of the coordinates.
 *
 * rotateYDirection (default: REVERSE): Y Correct the direction of the coordinates.
 *
 * rotateZDirection (default: REVERSE): Z Correct the direction of the coordinates.
 *
 * @returns
 *
 * orientation: Pivot Orientation
 *
 * originOrientation: The actual orientation of the device
 *
 * transformStyle: Rotation Conversion Style
 *
 * resetPivotOrientation: Pivot Orientation Initialization trigger
 */
export const useDeviceOrientation = (options?: DeviceOrientationHookOptions) => {
  const [originOrientation, setOriginOrientation] =
    useState<DeviceRotationRate>(defaultDeviceOrientation);
  const [orientation, setOrientation] = useState<DeviceRotationRate>(defaultDeviceOrientation);
  const [transformStyle, setTransformStyle] = useState<CSSProperties>();
  const initialOrientation = useRef<DeviceRotationRate | null>(null);

  const mergedOptions = { ...defaultDeviceOrientationHookOptions, ...options };

  const dispatch = useCallback(
    ({
      orientation,
      transformStyle,
    }: {
      orientation: DeviceRotationRate;
      transformStyle: CSSProperties;
    }) => {
      setOrientation(orientation);
      setTransformStyle(transformStyle);
    },
    []
  );

  const deviceOrientationListener = useCallback((data: DeviceMotionEventRotationRate) => {
    setOriginOrientation(data);

    if (initialOrientation.current === null) {
      initialOrientation.current = data;
    }

    dispatch(
      processDeviceOrientationOption
        .setData(data)
        .adjustByCorrection(
          mergedOptions.enableInitialOrientation || false,
          initialOrientation.current
        )
        .adjustDirection([
          mergedOptions.rotateXDirection || RotateDirection.NONE,
          mergedOptions.rotateYDirection || RotateDirection.NONE,
          mergedOptions.rotateZDirection || RotateDirection.NONE,
        ])
        .commit()
    );
  }, []);

  const resetPivotOrientation = useCallback(() => {
    initialOrientation.current = null;
  }, []);

  useEffect(() => {
    if (window.DeviceMotionEvent) {
      window.addEventListener('deviceorientation', deviceOrientationListener);

      return () => {
        window.removeEventListener('deviceorientation', deviceOrientationListener);
      };
    }

    return;
  }, [deviceOrientationListener]);

  return {
    orientation,
    originOrientation,
    transformStyle,
    resetPivotOrientation,
  };
};

export default useDeviceOrientation;
