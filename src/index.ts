type Num2 = [number, number]
type Num3 = [number, number, number]
type Num4 = [number, number, number, number]

type Vec2 = Num2
type Rgb = Num3

interface Event {
  mouse: MouseEvent
}

interface MouseEvent {
  initialGrab: boolean
  grabbed: boolean
  movementX: number
  movementY: number
}

class MathUtils {
  static degreesToRadians(deg: number): number {
    return (deg * Math.PI) / 180
  }
}

class Vec3 {
  protected _buffer: [number, number, number]

  constructor(buf: [number, number, number]) {
    this._buffer = buf
  }

  x = () => this._buffer[0]

  setX = (newX: number) => (this._buffer[0] = newX)

  y = () => this._buffer[1]

  setY = (newY: number) => (this._buffer[1] = newY)

  z = () => this._buffer[2]

  setZ = (newZ: number) => (this._buffer[2] = newZ)

  add(v: Vec3): Vec3 {
    const [x1, y1, z1] = this._buffer
    const [x2, y2, z2] = v._buffer
    return new Vec3([x1 + x2, y1 + y2, z1 + z2])
  }

  sub(v: Vec3): Vec3 {
    const [x1, y1, z1] = this._buffer
    const [x2, y2, z2] = v._buffer
    return new Vec3([x1 - x2, y1 - y2, z1 - z2])
  }

  normalize() {
    const [x, y, z] = this._buffer
    const len = Math.sqrt(x * x + y * y + z * z)

    if (len > 0.00001) return new Vec3([x / len, y / len, z / len])
    else return new Vec3([0, 0, 0])
  }

  cross(v: Vec3): Vec3 {
    const [x1, y1, z1] = this._buffer
    const [x2, y2, z2] = v._buffer
    return new Vec3([y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2])
  }
}

interface Ortho {
  top: number
  left: number
  right: number
  bottom: number
  near: number
  far: number
}

interface Perspective {
  fov: number
  aspect: number
  near: number
  far: number
}

class Matrix3 {
  readonly buffer: number[]

  private constructor(buffer: number[]) {
    this.buffer = buffer
  }

  static identity(): Matrix3 {
    return new Matrix3([1, 0, 0, 0, 1, 0, 0, 0, 1])
  }

  static translation([tx, ty]: Vec2): Matrix3 {
    return new Matrix3([1, 0, 0, 0, 1, 0, tx, ty, 1])
  }

  static rotation(radians: number): Matrix3 {
    const c = Math.cos(radians)
    const s = Math.sin(radians)

    return new Matrix3([c, -s, 0, s, c, 0, 0, 0, 1])
  }

  static scale([sx, sy]: Vec2): Matrix3 {
    return new Matrix3([sx, 0, 0, 0, sy, 0, 0, 0, 1])
  }

  static orthographic([right, bottom]: Vec2): Matrix3 {
    const top = 0
    const left = 0

    return new Matrix3([
      2 / (right - left),
      0,
      0,
      0,
      2 / (top - bottom),
      0,
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      1,
    ])
  }

  get(column: number, row: number): number {
    const matrixSize = 3
    return this.buffer[(column - 1) * matrixSize + (row - 1)]!
  }

  multiply(b: Matrix3): Matrix3 {
    return new Matrix3([
      b.get(1, 1) * this.get(1, 1) +
        b.get(1, 2) * this.get(2, 1) +
        b.get(1, 3) * this.get(3, 1), // [1,1]
      b.get(1, 1) * this.get(1, 2) +
        b.get(1, 2) * this.get(2, 2) +
        b.get(1, 3) * this.get(3, 2), // [1,2]
      b.get(1, 1) * this.get(1, 3) +
        b.get(1, 2) * this.get(2, 3) +
        b.get(1, 3) * this.get(3, 3), // [1,3]
      b.get(2, 1) * this.get(1, 1) +
        b.get(2, 2) * this.get(2, 1) +
        b.get(2, 3) * this.get(3, 1), // [2,1]
      b.get(2, 1) * this.get(1, 2) +
        b.get(2, 2) * this.get(2, 2) +
        b.get(2, 3) * this.get(3, 2), // [2,2]
      b.get(2, 1) * this.get(1, 3) +
        b.get(2, 2) * this.get(2, 3) +
        b.get(2, 3) * this.get(3, 3), // [2,3]
      b.get(3, 1) * this.get(1, 1) +
        b.get(3, 2) * this.get(2, 1) +
        b.get(3, 3) * this.get(3, 1), // [3,1]
      b.get(3, 1) * this.get(1, 2) +
        b.get(3, 2) * this.get(2, 2) +
        b.get(3, 3) * this.get(3, 2), // [3,2]
      b.get(3, 1) * this.get(1, 3) +
        b.get(3, 2) * this.get(2, 3) +
        b.get(3, 3) * this.get(3, 3), // [3,3]
    ])
  }

  translate(t: Vec2): Matrix3 {
    return this.multiply(Matrix3.translation(t))
  }

  rotate(radians: number): Matrix3 {
    return this.multiply(Matrix3.rotation(radians))
  }

  scale(s: Vec2): Matrix3 {
    return this.multiply(Matrix3.scale(s))
  }
}

class Matrix4 {
  readonly buffer: number[]

  private constructor(buf: number[]) {
    this.buffer = buf
  }

  static identity(): Matrix4 {
    return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  }

  static translation(tx: number, ty: number, tz: number): Matrix4 {
    return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1])
  }

  static xRotation(radians: number): Matrix4 {
    const c = Math.cos(radians)
    const s = Math.sin(radians)

    return new Matrix4([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1])
  }

  static yRotation(radians: number): Matrix4 {
    const c = Math.cos(radians)
    const s = Math.sin(radians)

    return new Matrix4([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1])
  }

  static zRotation(radians: number): Matrix4 {
    const c = Math.cos(radians)
    const s = Math.sin(radians)

    return new Matrix4([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  }

  static scale(sx: number, sy: number, sz: number): Matrix4 {
    return new Matrix4([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1])
  }

  static orthographic({ top, left, right, bottom, near, far }: Ortho): Matrix4 {
    return new Matrix4([
      2 / (right - left),
      0,
      0,
      0,
      0,
      2 / (top - bottom),
      0,
      0,
      0,
      0,
      -2 / (far - near),
      0,

      -(right + left) / (right - left),
      -(top + bottom) / (top - bottom),
      -(far + near) / (far - near),
      1,
    ])
  }

  static perspective({ fov, aspect, near, far }: Perspective): Matrix4 {
    const radians = (fov * Math.PI) / 180
    const f = Math.tan(Math.PI * 0.5 - 0.5 * radians)

    return new Matrix4([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (far + near) / (near - far),
      -1,
      0,
      0,
      (2 * far * near) / (near - far),
      0,
    ])
  }

  static lookAt(cameraPos: Vec3, target: Vec3, up: Vec3): Matrix4 {
    const zAxis = cameraPos.sub(target).normalize()
    const xAxis = up.cross(zAxis).normalize()
    const yAxis = zAxis.cross(xAxis).normalize()

    return new Matrix4([
      xAxis.x(),
      xAxis.y(),
      xAxis.z(),
      0,
      yAxis.x(),
      yAxis.y(),
      yAxis.z(),
      0,
      zAxis.x(),
      zAxis.y(),
      zAxis.z(),
      0,
      cameraPos.x(),
      cameraPos.y(),
      cameraPos.z(),
      1,
    ])
  }

  get(column: number, row: number): number {
    const matrixSize = 4
    return this.buffer[(column - 1) * matrixSize + (row - 1)]!
  }

  multiply(b: Matrix4): Matrix4 {
    const b11 = b.get(1, 1)
    const b12 = b.get(1, 2)
    const b13 = b.get(1, 3)
    const b14 = b.get(1, 4)
    const b21 = b.get(2, 1)
    const b22 = b.get(2, 2)
    const b23 = b.get(2, 3)
    const b24 = b.get(2, 4)
    const b31 = b.get(3, 1)
    const b32 = b.get(3, 2)
    const b33 = b.get(3, 3)
    const b34 = b.get(3, 4)
    const b41 = b.get(4, 1)
    const b42 = b.get(4, 2)
    const b43 = b.get(4, 3)
    const b44 = b.get(4, 4)

    const a11 = this.get(1, 1)
    const a12 = this.get(1, 2)
    const a13 = this.get(1, 3)
    const a14 = this.get(1, 4)
    const a21 = this.get(2, 1)
    const a22 = this.get(2, 2)
    const a23 = this.get(2, 3)
    const a24 = this.get(2, 4)
    const a31 = this.get(3, 1)
    const a32 = this.get(3, 2)
    const a33 = this.get(3, 3)
    const a34 = this.get(3, 4)
    const a41 = this.get(4, 1)
    const a42 = this.get(4, 2)
    const a43 = this.get(4, 3)
    const a44 = this.get(4, 4)

    return new Matrix4([
      b11 * a11 + b12 * a21 + b13 * a31 + b14 * a41,
      b11 * a12 + b12 * a22 + b13 * a32 + b14 * a42,
      b11 * a13 + b12 * a23 + b13 * a33 + b14 * a43,
      b11 * a14 + b12 * a24 + b13 * a34 + b14 * a44,
      b21 * a11 + b22 * a21 + b23 * a31 + b24 * a41,
      b21 * a12 + b22 * a22 + b23 * a32 + b24 * a42,
      b21 * a13 + b22 * a23 + b23 * a33 + b24 * a43,
      b21 * a14 + b22 * a24 + b23 * a34 + b24 * a44,
      b31 * a11 + b32 * a21 + b33 * a31 + b34 * a41,
      b31 * a12 + b32 * a22 + b33 * a32 + b34 * a42,
      b31 * a13 + b32 * a23 + b33 * a33 + b34 * a43,
      b31 * a14 + b32 * a24 + b33 * a34 + b34 * a44,
      b41 * a11 + b42 * a21 + b43 * a31 + b44 * a41,
      b41 * a12 + b42 * a22 + b43 * a32 + b44 * a42,
      b41 * a13 + b42 * a23 + b43 * a33 + b44 * a43,
      b41 * a14 + b42 * a24 + b43 * a34 + b44 * a44,
    ])
  }

  inverse(): Matrix4 {
    const m00 = this.buffer[0 * 4 + 0]!
    const m01 = this.buffer[0 * 4 + 1]!
    const m02 = this.buffer[0 * 4 + 2]!
    const m03 = this.buffer[0 * 4 + 3]!
    const m10 = this.buffer[1 * 4 + 0]!
    const m11 = this.buffer[1 * 4 + 1]!
    const m12 = this.buffer[1 * 4 + 2]!
    const m13 = this.buffer[1 * 4 + 3]!
    const m20 = this.buffer[2 * 4 + 0]!
    const m21 = this.buffer[2 * 4 + 1]!
    const m22 = this.buffer[2 * 4 + 2]!
    const m23 = this.buffer[2 * 4 + 3]!
    const m30 = this.buffer[3 * 4 + 0]!
    const m31 = this.buffer[3 * 4 + 1]!
    const m32 = this.buffer[3 * 4 + 2]!
    const m33 = this.buffer[3 * 4 + 3]!

    const tmp_0 = m22 * m33
    const tmp_1 = m32 * m23
    const tmp_2 = m12 * m33
    const tmp_3 = m32 * m13
    const tmp_4 = m12 * m23
    const tmp_5 = m22 * m13
    const tmp_6 = m02 * m33
    const tmp_7 = m32 * m03
    const tmp_8 = m02 * m23
    const tmp_9 = m22 * m03
    const tmp_10 = m02 * m13
    const tmp_11 = m12 * m03
    const tmp_12 = m20 * m31
    const tmp_13 = m30 * m21
    const tmp_14 = m10 * m31
    const tmp_15 = m30 * m11
    const tmp_16 = m10 * m21
    const tmp_17 = m20 * m11
    const tmp_18 = m00 * m31
    const tmp_19 = m30 * m01
    const tmp_20 = m00 * m21
    const tmp_21 = m20 * m01
    const tmp_22 = m00 * m11
    const tmp_23 = m10 * m01

    const t0 =
      tmp_0 * m11 +
      tmp_3 * m21 +
      tmp_4 * m31 -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
    const t1 =
      tmp_1 * m01 +
      tmp_6 * m21 +
      tmp_9 * m31 -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
    const t2 =
      tmp_2 * m01 +
      tmp_7 * m11 +
      tmp_10 * m31 -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
    const t3 =
      tmp_5 * m01 +
      tmp_8 * m11 +
      tmp_11 * m21 -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

    const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

    return new Matrix4([
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d *
        (tmp_1 * m10 +
          tmp_2 * m20 +
          tmp_5 * m30 -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d *
        (tmp_0 * m00 +
          tmp_7 * m20 +
          tmp_8 * m30 -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d *
        (tmp_3 * m00 +
          tmp_6 * m10 +
          tmp_11 * m30 -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d *
        (tmp_4 * m00 +
          tmp_9 * m10 +
          tmp_10 * m20 -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d *
        (tmp_12 * m13 +
          tmp_15 * m23 +
          tmp_16 * m33 -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d *
        (tmp_13 * m03 +
          tmp_18 * m23 +
          tmp_21 * m33 -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d *
        (tmp_14 * m03 +
          tmp_19 * m13 +
          tmp_22 * m33 -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d *
        (tmp_17 * m03 +
          tmp_20 * m13 +
          tmp_23 * m23 -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d *
        (tmp_14 * m22 +
          tmp_17 * m32 +
          tmp_13 * m12 -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d *
        (tmp_20 * m32 +
          tmp_12 * m02 +
          tmp_19 * m22 -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d *
        (tmp_18 * m12 +
          tmp_23 * m32 +
          tmp_15 * m02 -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d *
        (tmp_22 * m22 +
          tmp_16 * m02 +
          tmp_21 * m12 -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
    ])
  }

  transpose(): Matrix4 {
    return new Matrix4([
      this.buffer[0]!,
      this.buffer[4]!,
      this.buffer[8]!,
      this.buffer[12]!,
      this.buffer[1]!,
      this.buffer[5]!,
      this.buffer[9]!,
      this.buffer[13]!,
      this.buffer[2]!,
      this.buffer[6]!,
      this.buffer[10]!,
      this.buffer[14]!,
      this.buffer[3]!,
      this.buffer[7]!,
      this.buffer[11]!,
      this.buffer[15]!,
    ])
  }

  translate(tx: number, ty: number, tz: number): Matrix4 {
    return this.multiply(Matrix4.translation(tx, ty, tz))
  }

  xRotate(radians: number): Matrix4 {
    return this.multiply(Matrix4.xRotation(radians))
  }

  yRotate(radians: number): Matrix4 {
    return this.multiply(Matrix4.yRotation(radians))
  }

  zRotate(radians: number): Matrix4 {
    return this.multiply(Matrix4.zRotation(radians))
  }

  scale(sx: number, sy: number, sz: number): Matrix4 {
    return this.multiply(Matrix4.scale(sx, sy, sz))
  }
}

class Transform2D {
  translation: Vec2
  rotationDegrees: number
  scale: Vec2

  constructor() {
    this.translation = [0, 0]
    this.rotationDegrees = 0
    this.scale = [1, 1]
  }

  getMatrix(viewport: Vec2) {
    return Matrix3.orthographic(viewport)
      .translate(this.translation)
      .rotate(this.rotationDegrees)
      .scale(this.scale)
  }
}

type TransformKey = 'tx' | 'ty' | 'tz' | 'rx' | 'ry' | 'rz' | 'sx' | 'sy' | 'sz'

type Transform3DProperty = {
  (): Num3
  (x: number, y: number, z: number): void
}

type AnimationCallback = (dt: number) => void

type AnimationType = 'constant' | 'wave' | AnimationCallback

interface TransformAnimation {
  enabled: boolean
  key: TransformKey
  speed: number
  func: AnimationType
}

class Transform3D {
  tx: number
  ty: number
  tz: number
  rx: number
  ry: number
  rz: number
  sx: number
  sy: number
  sz: number

  constructor() {
    this.tx = 0
    this.ty = 0
    this.tz = 0
    this.rx = 0
    this.ry = 0
    this.rz = 0
    this.sx = 1
    this.sy = 1
    this.sz = 1
  }

  worldMatrix() {
    const { tx, ty, tz, rx, ry, rz, sx, sy, sz } = this
    return Matrix4.translation(tx, ty, tz)
      .xRotate(rx)
      .yRotate(ry)
      .zRotate(rz)
      .scale(sx, sy, sz)
  }

  translation: Transform3DProperty = (
    x?: number,
    y?: number,
    z?: number,
  ): any => {
    if (
      typeof x !== 'undefined' &&
      typeof y !== 'undefined' &&
      typeof z !== 'undefined'
    ) {
      this.tx = x
      this.ty = y
      this.tz = z
    } else {
      return [this.tx, this.ty, this.tz]
    }
  }

  rotation: Transform3DProperty = (x?: number, y?: number, z?: number): any => {
    if (
      typeof x !== 'undefined' &&
      typeof y !== 'undefined' &&
      typeof z !== 'undefined'
    ) {
      this.rx = x
      this.ry = y
      this.rz = z
    } else {
      return [this.rx, this.ry, this.rz]
    }
  }

  scale: Transform3DProperty = (x?: number, y?: number, z?: number): any => {
    if (
      typeof x !== 'undefined' &&
      typeof y !== 'undefined' &&
      typeof z !== 'undefined'
    ) {
      this.sx = x
      this.sy = y
      this.sz = z
    } else {
      return [this.sx, this.sy, this.sz]
    }
  }

  createUIFactory(): Transform3DUIFactory {
    return new Transform3DUIFactory(this)
  }
}

interface Transform3DUIOptions {
  xMax: number
  xMin?: number
  yMax: number
  yMin?: number
  zMax: number
  zMin?: number
}

interface Transform3DUISlider {
  min?: number
  scaleFactor?: number
}

class Transform3DUIFactory {
  private _t: Transform3D

  constructor(t: Transform3D) {
    this._t = t
  }

  slider(
    key: TransformKey,
    name: string,
    max: number,
    { min = -max, scaleFactor = 1 }: Transform3DUISlider = {},
  ): Slider {
    const axis = key.at(1)
    let callback: (value: string, ui: SimpleUI) => void

    switch (key) {
      case 'tx':
      case 'ty':
      case 'tz':
        callback = (v) => (this._t[key] = Number.parseFloat(v))
        break

      case 'rx':
      case 'ry':
      case 'rz':
        callback = (v) =>
          (this._t[key] = MathUtils.degreesToRadians(Number.parseFloat(v)))
        break

      case 'sx':
      case 'sy':
      case 'sz':
        callback = (v) => (this._t[key] = Number.parseFloat(v) / scaleFactor)
        break
    }

    return {
      type: 'slider',
      id: `${name}-${axis}-axis`,
      label: `${axis?.toUpperCase()} Axis`,
      min,
      max,
      initialValue: this._t[key],
      onInput: callback,
    }
  }

  translationGroup(
    name: string,
    options: Transform3DUIOptions = { xMax: 1000, yMax: 1000, zMax: 1000 },
  ): UIComponentGroup {
    const groupId = `${name.toLowerCase()}-translation`
    return {
      type: 'group',
      id: groupId,
      legend: `${name} Translation`,
      components: [
        this.slider('tx', groupId, options.xMax),
        this.slider('ty', groupId, options.yMax),
        this.slider('tz', groupId, options.zMax),
      ],
    }
  }

  rotationGroup(
    name: string,
    options: Transform3DUIOptions = { xMax: 360, yMax: 360, zMax: 360 },
  ): UIComponentGroup {
    const groupId = `${name.toLowerCase()}-rotation}`
    return {
      type: 'group',
      id: groupId,
      legend: `${name} Rotation`,
      components: [
        this.slider('rx', groupId, options.xMax),
        this.slider('ry', groupId, options.yMax),
        this.slider('rz', groupId, options.zMax),
      ],
    }
  }

  scaleGroup(
    name: string,
    options: Transform3DUIOptions = { xMax: 20, yMax: 20, zMax: 20 },
  ): UIComponentGroup {
    const groupId = `${name.toLowerCase()}-scale`
    return {
      type: 'group',
      id: groupId,
      legend: `${name} Scale`,
      components: [
        this.slider('sx', groupId, options.xMax, { min: 0, scaleFactor: 10 }),
        this.slider('sy', groupId, options.yMax, { min: 0, scaleFactor: 10 }),
        this.slider('sz', groupId, options.zMax, { min: 0, scaleFactor: 10 }),
      ],
    }
  }
}

class Transform3DAnimator {
  private _t: Transform3D
  private _animations: { [key in TransformKey]?: [boolean, AnimationCallback] }

  constructor(t: Transform3D) {
    this._t = t
    this._animations = {}
  }

  addAnimation({ enabled, key, func, speed }: TransformAnimation) {
    switch (func) {
      case 'constant':
        this._animations[key] = [enabled, (dt) => (this._t[key] += speed * dt)]
        break

      case 'wave':
        let n = 0
        this._animations[key] = [
          enabled,
          (dt) => (this._t[key] = 1 + 5 * Math.sin(n++ * speed) * dt),
        ]
        break

      default:
        this._animations[key] = [enabled, func]
        break
    }
  }

  animating(key: TransformKey, isAnimating: boolean) {
    const transform = this._animations[key]
    transform && (transform[0] = isAnimating)
  }

  animate(dt: number) {
    for (const key of Object.keys(this._animations)) {
      const enabled = this._animations[key as TransformKey]?.[0]
      const animation = this._animations[key as TransformKey]?.[1]

      if (enabled && animation) animation(dt)
    }
  }
}

class RenderCtxObject {
  protected _ctx: WebGL2RenderingContext

  constructor(ctx: WebGL2RenderingContext) {
    this._ctx = ctx
  }
}

type ShaderType = 'fragment' | 'vertex'

type CreateProgram = {
  (shaders: ProgramShaders): Program
  (idPrefix: string): Program
}

type SetUniform = {
  (name: string, x: number): void
  (name: string, x: number, y: number): void
  (name: string, x: number, y: number, z: number): void
  (name: string, x: Matrix3): void
  (name: string, x: Matrix4): void
}

interface ProgramShaders {
  vertex: WebGLShader
  fragment: WebGLShader
}

type AttribPointerType = 'float' | 'ubyte'

interface AttribPointer {
  name: string
  size: number
  type: AttribPointerType
  normalized?: boolean
  stride?: number
  offset?: number
}

class Program extends RenderCtxObject {
  protected _handle: WebGLProgram
  protected _attributes: Map<string, number>
  protected _isLinked: boolean
  readonly uniforms: Map<string, WebGLUniformLocation>

  constructor(ctx: WebGL2RenderingContext, shaders: ProgramShaders) {
    super(ctx)

    this._handle = this._ctx.createProgram()
    this._attributes = new Map()
    this.uniforms = new Map()
    this._isLinked = false

    this._ctx.attachShader(this._handle, shaders.vertex)
    this._ctx.attachShader(this._handle, shaders.fragment)
  }

  link() {
    if (this._isLinked) return

    this._ctx.linkProgram(this._handle)

    const success = this._ctx.getProgramParameter(
      this._handle,
      this._ctx.LINK_STATUS,
    )

    if (!success) {
      const log = this._ctx.getProgramInfoLog(this._handle)
      this._ctx.deleteProgram(this._handle)

      throw new Error(log ?? 'Failed to link a shader program')
    }

    const nAttribs = this._ctx.getProgramParameter(
      this._handle,
      this._ctx.ACTIVE_ATTRIBUTES,
    )

    for (let i = 0; i < nAttribs; i++) {
      const attrib = this._ctx.getActiveAttrib(this._handle, i)

      if (!attrib) continue

      const location = this._ctx.getAttribLocation(this._handle, attrib.name)
      this._attributes.set(attrib.name, location)
    }

    const nUniforms = this._ctx.getProgramParameter(
      this._handle,
      this._ctx.ACTIVE_UNIFORMS,
    )

    for (let i = 0; i < nUniforms; i++) {
      const attrib = this._ctx.getActiveUniform(this._handle, i)

      if (!attrib) continue

      const location = this._ctx.getUniformLocation(this._handle, attrib.name)

      if (!location) {
        console.warn(`Couldn't locate '${attrib.name}' uniform location`)
        continue
      }

      location && this.uniforms.set(attrib.name, location)
    }

    this._isLinked = true
  }

  setupAttribPointer({
    name,
    size,
    type,
    normalized = false,
    stride = 0,
    offset = 0,
  }: AttribPointer) {
    const location = this._attributes.get(name)

    type PtrLookup = {
      [key in AttribPointerType]: number
    }

    const typeLookup: PtrLookup = {
      float: this._ctx.FLOAT,
      ubyte: this._ctx.UNSIGNED_BYTE,
    }

    if (location === undefined)
      throw new Error(`Attribute '${name}' is not defined in current program`)

    this._ctx.enableVertexAttribArray(location)

    this._ctx.vertexAttribPointer(
      location,
      size,
      typeLookup[type],
      normalized,
      stride,
      offset,
    )
  }

  setUniform: SetUniform = (
    name: string,
    x: number | Matrix3 | Matrix4,
    y?: number,
    z?: number,
  ) => {
    const location = this.uniforms.get(name)

    if (location === undefined)
      throw new Error(`Uniform '${name}' is not defined in current program`)

    if (typeof x === 'number' && y !== undefined && z !== undefined) {
      this._ctx.uniform3f(location, x, y, z)
    } else if (typeof x === 'number' && y !== undefined) {
      this._ctx.uniform2f(location, x, y)
    } else if (typeof x === 'number') {
      this._ctx.uniform1f(location, x)
    } else if (x instanceof Matrix3) {
      this._ctx.uniformMatrix3fv(location, false, x.buffer)
    } else if (x instanceof Matrix4) {
      this._ctx.uniformMatrix4fv(location, false, x.buffer)
    }
  }

  use() {
    this._ctx.useProgram(this._handle)
  }
}

interface VertexBuffer {
  name: string
  size: number
  normalized?: boolean
  data: Float32Array | Uint8Array
}

class VertexArray extends RenderCtxObject {
  protected _handle: WebGLVertexArrayObject
  protected _ebo: WebGLBuffer | undefined

  readonly vbos: Map<string, { buffer: WebGLBuffer; ptr: AttribPointer }>

  constructor(ctx: WebGL2RenderingContext) {
    super(ctx)

    this._handle = this._ctx.createVertexArray()
    this.vbos = new Map()
  }

  bind() {
    this._ctx.bindVertexArray(this._handle)
  }

  addVertexBuffer({
    name,
    size,
    normalized = false,
    data,
  }: VertexBuffer): AttribPointer {
    const vbo = this._ctx.createBuffer()
    this._ctx.bindBuffer(this._ctx.ARRAY_BUFFER, vbo)
    this._ctx.bufferData(this._ctx.ARRAY_BUFFER, data, this._ctx.STATIC_DRAW)

    let type: AttribPointerType

    if (data instanceof Float32Array) {
      type = 'float'
    } else if (data instanceof Uint8Array) {
      type = 'ubyte'
    } else {
      throw new Error('unsupported buffer type')
    }

    this.vbos.set(name, {
      buffer: vbo,
      ptr: { name: name, type, size: size, normalized },
    })

    return { name: name, type, size: size, normalized }
  }
}

class RenderContext {
  protected _canvas: HTMLCanvasElement
  protected _observer: ResizeObserver | undefined
  gl: WebGL2RenderingContext
  canvasSize: [number, number]

  private constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('webgl2')

    if (!ctx) throw new Error('Failed to acquire WebGL2 context')

    this.gl = ctx
    this._canvas = canvas
    this.canvasSize = [this._canvas.width, this._canvas.height]
  }

  static async create(canvas: HTMLCanvasElement): Promise<RenderContext> {
    const ctx = new RenderContext(canvas)
    ctx._observer = await ctx._setupCanvasResizeObserver()

    return ctx
  }

  setCanvasSize(width: number, height: number) {
    this.canvasSize = [width, height]
  }

  createShaderFromHtml(id: string, type: ShaderType): WebGLShader {
    const el = document.getElementById(id)
    if (!el) throw new Error(`Failed to get HTML element with '${id}' id`)

    const source = el.textContent.trimStart()

    // we garantee with ShaderType that this function call
    // never fail because we cannot pass invalid shader type
    const handle = this.gl.createShader(
      ((type: ShaderType) => {
        switch (type) {
          case 'vertex':
            return this.gl.VERTEX_SHADER
          case 'fragment':
            return this.gl.FRAGMENT_SHADER
        }
      })(type),
    )!

    this.gl.shaderSource(handle, source)
    this.gl.compileShader(handle)

    const success = this.gl.getShaderParameter(
      handle,
      this.gl.COMPILE_STATUS,
    ) as boolean

    if (!success) {
      const log = this.gl.getShaderInfoLog(handle)
      this.gl.deleteShader(handle)
      throw new Error(`Compiled shader '${id}' with error: ${log}`)
    }

    return handle
  }

  createProgram: CreateProgram = (param: ProgramShaders | string) => {
    if (typeof param === 'string') {
      const idPrefix = param
      const vertex = this.createShaderFromHtml(`${idPrefix}-vert`, 'vertex')
      const fragment = this.createShaderFromHtml(`${idPrefix}-frag`, 'fragment')
      const program = new Program(this.gl, { vertex, fragment })

      this.gl.deleteShader(vertex)
      this.gl.deleteShader(fragment)

      return program
    }

    const shaders = param
    return new Program(this.gl, shaders)
  }

  createVertexArray(): VertexArray {
    return new VertexArray(this.gl)
  }

  resizeCanvas() {
    const [width, height] = this.canvasSize

    const needResize =
      this._canvas.width !== width || this._canvas.height !== height

    if (needResize) {
      this._canvas.width = width
      this._canvas.height = height
    }
  }

  private async _setupCanvasResizeObserver() {
    return new Promise<ResizeObserver>((resolve) => {
      const observer = new ResizeObserver((entries) => {
        RenderContext._resizeObserverCallback(this, entries)
        resolve(observer)
      })

      try {
        observer.observe(this._canvas, {
          box: 'device-pixel-content-box',
        })
      } catch (_) {
        observer.observe(this._canvas, { box: 'content-box' })
      }
    })
  }

  private static _resizeObserverCallback(
    ctx: RenderContext,
    entries: ResizeObserverEntry[],
  ) {
    const canvasEntry = entries.at(0)

    if (canvasEntry === undefined) return

    let w = canvasEntry.contentRect.width
    let h = canvasEntry.contentRect.height
    let dpr = window.devicePixelRatio

    if (canvasEntry.devicePixelContentBoxSize[0]) {
      w = canvasEntry.devicePixelContentBoxSize[0].inlineSize
      h = canvasEntry.devicePixelContentBoxSize[0].blockSize
      dpr = 1
    } else if (canvasEntry.contentBoxSize[0]) {
      w = canvasEntry.contentBoxSize[0].inlineSize
      h = canvasEntry.contentBoxSize[0].blockSize
    }

    const displayWidth = Math.round(w * dpr)
    const displayHeight = Math.round(h * dpr)

    ctx.setCanvasSize(displayWidth, displayHeight)
  }
}

interface GeometryData {
  vertexData: VertexBuffer
  colorData?: VertexBuffer
  normalData?: VertexBuffer
}

class Geometry {
  static square(): GeometryData {
    return {
      vertexData: {
        name: 'aPosition',
        size: 2,
        data: new Float32Array([0, 0, 0, 10, 10, 10, 0, 0, 10, 10, 10, 0]),
      },
    }
  }

  static FLetter2D(): GeometryData {
    return {
      vertexData: {
        name: 'aPosition',
        size: 2,
        data: new Float32Array([
          // left column
          0, 0, 0, 150, 30, 0, 0, 150, 30, 150, 30, 0,

          // top rung
          30, 0, 30, 30, 100, 0, 30, 30, 100, 30, 100, 0,

          // middle rung
          30, 60, 30, 90, 67, 60, 30, 90, 67, 90, 67, 60,
        ]),
      },
    }
  }

  static Box(): GeometryData {
    return {
      vertexData: {
        name: 'aPosition',
        size: 3,
        data: new Float32Array([
          // Front face
          -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
          -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,

          // Back face
          -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
          0.5, 0.5, -0.5, -0.5, 0.5,

          // Left face
          -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
          -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,

          // Right face
          0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
          0.5, 0.5, 0.5, -0.5, 0.5,

          // Bottom face
          -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
          -0.5, -0.5, 0.5, -0.5, -0.5, -0.5,

          // Top face
          -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5,
          0.5, -0.5, -0.5, 0.5, 0.5,
        ]),
      },
      colorData: {
        name: 'aColor',
        size: 3,
        data: new Float32Array([
          // Front face
          0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
          0.0, -1.0, 0.0, 0.0, -1.0,

          // Back face
          0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
          1.0, 0.0, 0.0, 1.0,

          // Left face
          -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
          0.0, 0.0, -1.0, 0.0, 0.0,

          // Right face
          1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
          0.0, 1.0, 0.0, 0.0,

          // Bottom face
          0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0, -1.0, 0.0,

          // Top face
          0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
          0.0, 0.0, 1.0, 0.0,
        ]),
      },
      normalData: {
        name: 'aNormal',
        size: 3,
        data: new Float32Array([
          // Front face
          0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
          0.0, -1.0, 0.0, 0.0, -1.0,

          // Back face
          0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
          1.0, 0.0, 0.0, 1.0,

          // Left face
          1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
          0.0, 1.0, 0.0, 0.0,

          // Right face
          1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
          0.0, 1.0, 0.0, 0.0,

          // Bottom face
          0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0, -1.0, 0.0,

          // Top face
          0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
          0.0, 0.0, 1.0, 0.0,
        ]),
      },
    }
  }

  static FLetter3D(): GeometryData {
    return {
      vertexData: {
        name: 'aPosition',
        size: 3,
        data: new Float32Array([
          // left column front
          0, 0, 0, 0, -150, 0, 30, 0, 0, 0, -150, 0, 30, -150, 0, 30, 0, 0,

          // top rung front
          30, 0, 0, 30, -30, 0, 100, 0, 0, 30, -30, 0, 100, -30, 0, 100, 0, 0,

          // middle rung front
          30, -60, 0, 30, -90, 0, 67, -60, 0, 30, -90, 0, 67, -90, 0, 67, -60,
          0,

          // left column back
          0, 0, -30, 30, 0, -30, 0, -150, -30, 0, -150, -30, 30, 0, -30, 30,
          -150, -30,

          // top rung back
          30, 0, -30, 100, 0, -30, 30, -30, -30, 30, -30, -30, 100, 0, -30, 100,
          -30, -30,

          // middle rung back
          30, -60, -30, 67, -60, -30, 30, -90, -30, 30, -90, -30, 67, -60, -30,
          67, -90, -30,

          // top
          0, 0, 0, 100, 0, 0, 100, 0, -30, 0, 0, 0, 100, 0, -30, 0, 0, -30,

          // top rung right
          100, 0, 0, 100, -30, 0, 100, -30, -30, 100, 0, 0, 100, -30, -30, 100,
          0, -30,

          // under top rung
          30, -30, 0, 30, -30, -30, 100, -30, -30, 30, -30, 0, 100, -30, -30,
          100, -30, 0,

          // between top rung and middle
          30, -30, 0, 30, -60, -30, 30, -30, -30, 30, -30, 0, 30, -60, 0, 30,
          -60, -30,

          // top of middle rung
          30, -60, 0, 67, -60, -30, 30, -60, -30, 30, -60, 0, 67, -60, 0, 67,
          -60, -30,

          // right of middle rung
          67, -60, 0, 67, -90, -30, 67, -60, -30, 67, -60, 0, 67, -90, 0, 67,
          -90, -30,

          // bottom of middle rung.
          30, -90, 0, 30, -90, -30, 67, -90, -30, 30, -90, 0, 67, -90, -30, 67,
          -90, 0,

          // right of bottom
          30, -90, 0, 30, -150, -30, 30, -90, -30, 30, -90, 0, 30, -150, 0, 30,
          -150, -30,

          // bottom
          0, -150, 0, 0, -150, -30, 30, -150, -30, 0, -150, 0, 30, -150, -30,
          30, -150, 0,

          // left side
          0, 0, 0, 0, 0, -30, 0, -150, -30, 0, 0, 0, 0, -150, -30, 0, -150, 0,
        ]),
      },
      colorData: {
        name: 'aColor',
        size: 3,
        normalized: true,
        data: new Uint8Array([
          // left column front
          200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,
          200, 70, 120,

          // top rung front
          200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,
          200, 70, 120,

          // middle rung front
          200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,
          200, 70, 120,

          // left column back
          80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80,
          70, 200,

          // top rung back
          80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80,
          70, 200,

          // middle rung back
          80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80,
          70, 200,

          // top
          70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210,
          70, 200, 210,

          // top rung right
          200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70,
          200, 200, 70,

          // under top rung
          210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70,
          210, 100, 70,

          // between top rung and middle
          210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70,
          210, 160, 70,

          // top of middle rung
          70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210,
          70, 180, 210,

          // right of middle rung
          100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210,
          100, 70, 210,

          // bottom of middle rung.
          76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100,
          76, 210, 100,

          // right of bottom
          140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80,
          140, 210, 80,

          // bottom
          90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110,
          90, 130, 110,

          // left side
          160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160,
          220, 160, 160, 220,
        ]),
      },
      normalData: {
        name: 'aNormal',
        size: 3,
        data: new Float32Array([
          // left column front
          0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

          // top rung front
          0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

          // middle rung front
          0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

          // left column back
          0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

          // top rung back
          0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

          // middle rung back
          0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

          // top
          0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

          // top rung right
          1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

          // under top rung
          0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

          // between top rung and middle
          1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

          // top of middle rung
          0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

          // right of middle rung
          1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

          // bottom of middle rung.
          0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

          // right of bottom
          1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

          // bottom
          0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

          // left side
          -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        ]),
      },
    }
  }
}

interface UIComponentBase {
  id: string
  label: string
  persist?: boolean
  onInput: (value: string, ui: SimpleUI) => void
}

interface DropdownOptions extends UIComponentBase {
  type: 'dropdown'
  options: { name: string; value: string }[]
}

interface Slider extends UIComponentBase {
  type: 'slider'
  min?: number
  max: number
  initialValue?: number
}

interface Radio extends UIComponentBase {
  type: 'radio'
  name: string
  value: string
  checked?: boolean
}

interface Checkbox extends UIComponentBase {
  type: 'checkbox'
  checked?: boolean
}

interface UIComponentGroup {
  type: 'group'
  id: string
  legend: string
  components: UIComponent[]
}

type UIComponent =
  | DropdownOptions
  | Slider
  | Radio
  | Checkbox
  | UIComponentGroup

class SimpleUI {
  protected _root: HTMLElement
  protected _persisting: Set<string>

  constructor(rootId: string) {
    const root = document.getElementById(rootId)

    if (!root)
      throw new Error(`Couldn't find mount point for UI with '${rootId}' id`)

    this._root = root
    this._persisting = new Set()
  }

  mount(component: UIComponent | UIComponent[]) {
    if (Array.isArray(component))
      component.forEach((c) => this._mountOn(this._root, c))
    else this._mountOn(this._root, component)
  }

  disable(name: string) {
    const el = document.getElementById(name) as HTMLInputElement
    el.disabled = true
  }

  enable(name: string) {
    const el = document.getElementById(name) as HTMLInputElement
    el.disabled = false
  }

  clear() {
    const purgeList: ChildNode[] = []

    this._root.childNodes.forEach((child) => {
      if (!this._persisting.has((child as HTMLElement).id)) {
        purgeList.push(child)
      }
    })

    purgeList.forEach((child) => this._root.removeChild(child))
  }

  private _mountOn(parent: HTMLElement, component: UIComponent) {
    switch (component.type) {
      case 'dropdown': {
        const [label, select] = this._createDropdown(component)
        parent.appendChild(label)
        parent.appendChild(select)
        break
      }
      case 'slider': {
        const [label, input] = this._createSlider(component)
        parent.appendChild(label)
        parent.appendChild(input)
        break
      }
      case 'checkbox': {
        const checkbox = this._createCheckbox(component)
        parent.appendChild(checkbox)
        break
      }
      case 'radio': {
        const radio = this._createRadio(component)
        parent.appendChild(radio)
        break
      }
      case 'group': {
        const fieldset = this._createGroup(component)
        parent.appendChild(fieldset)
        break
      }
    }
  }

  private _createGroup({ id, legend, components }: UIComponentGroup) {
    const $fieldset = document.createElement('fieldset')
    const $legend = document.createElement('legend')

    $fieldset.id = id
    $legend.textContent = legend

    $fieldset.appendChild($legend)

    for (const component of components) this._mountOn($fieldset, component)

    return $fieldset
  }

  private _createDropdown({
    id: name,
    label: displayName,
    persist = false,
    options,
    onInput,
  }: DropdownOptions): [HTMLLabelElement, HTMLSelectElement] {
    const select = document.createElement('select')
    const label = document.createElement('label')

    select.name = name
    select.id = name
    select.title = displayName || name

    select.addEventListener('input', (e) =>
      onInput((e.target as HTMLInputElement).value, this),
    )

    options.forEach((opt) => {
      const option = document.createElement('option')
      option.value = opt.value
      option.textContent = opt.name
      select.appendChild(option)
    })

    label.id = `${name}-label`
    label.htmlFor = name
    label.innerText = displayName || name

    if (persist) {
      this._persisting.add(select.id)
      this._persisting.add(label.id)
    }

    return [label, select]
  }

  private _createSlider({
    id,
    label,
    min,
    max,
    initialValue,
    persist = false,
    onInput,
  }: Slider): [HTMLLabelElement, HTMLInputElement] {
    const { input: $input, label: $label } = this._createLabeledInput()

    const minStr = min?.toString() || '0'

    $input.type = 'range'
    $input.name = id
    $input.id = id
    $input.title = id
    $input.placeholder = '0'
    $input.min = minStr
    $input.max = max.toString()
    $input.value = initialValue?.toString() || minStr
    $input.addEventListener('input', (e) =>
      onInput((e.target as HTMLInputElement).value, this),
    )

    $label.id = `${id}-label`
    $label.htmlFor = id
    $label.innerText = label

    if (persist) {
      this._persisting.add($input.id)
      this._persisting.add($label.id)
    }

    return [$label, $input]
  }

  private _createRadio({
    id,
    name,
    label,
    value,
    checked = false,
    persist = false,
    onInput,
  }: Radio): HTMLDivElement {
    const div = document.createElement('div')
    const { input: $input, label: $label } = this._createLabeledInput()

    $input.type = 'radio'
    $input.checked = checked
    $input.name = name
    $input.id = id
    $input.value = value
    $input.addEventListener('input', (e) =>
      onInput((e.target as HTMLInputElement).value, this),
    )

    $label.textContent = label
    $label.htmlFor = $input.id

    div.appendChild($input)
    div.appendChild($label)

    if (persist) {
      this._persisting.add($input.id)
      this._persisting.add($label.id)
    }

    return div
  }

  private _createCheckbox({
    id: name,
    label: displayName,
    checked = false,
    persist,
    onInput,
  }: Checkbox): HTMLDivElement {
    const div = document.createElement('div')
    const { input, label } = this._createLabeledInput()

    div.id = name

    input.type = 'checkbox'
    input.name = name
    input.id = `${name}-input`
    input.title = name
    input.checked = checked
    input.addEventListener('click', (e) => {
      onInput((e.target as HTMLInputElement).checked.toString(), this)
    })

    label.id = `${name}-label`
    label.htmlFor = name
    label.innerText = displayName || name

    div.appendChild(input)
    div.appendChild(label)

    if (persist) {
      this._persisting.add(div.id)
    }

    return div
  }

  private _createLabeledInput(): {
    input: HTMLInputElement
    label: HTMLLabelElement
  } {
    return {
      input: document.createElement('input'),
      label: document.createElement('label'),
    }
  }
}

abstract class Scene {
  protected _ctx: RenderContext
  protected _clearColor: [number, number, number]
  protected _uiComponents: UIComponent[]

  readonly name: string

  constructor(
    ctx: RenderContext,
    name: string,
    clearColor: [number, number, number],
  ) {
    this._ctx = ctx
    this._clearColor = clearColor
    this._uiComponents = []

    this.name = name
  }

  setup(ui: SimpleUI): void {
    this._uiComponents.forEach((component) => ui.mount(component))
  }

  clearUi(ui: SimpleUI): void {
    ui.clear()
  }

  abstract update(e: Event): void

  render(dt: number): void {
    this._ctx.gl.viewport(
      0,
      0,
      this._ctx.gl.canvas.width,
      this._ctx.gl.canvas.height,
    )

    const [r, g, b] = this._clearColor
    this._ctx.gl.clearColor(r, g, b, 1)
    this._ctx.gl.clear(
      this._ctx.gl.COLOR_BUFFER_BIT | this._ctx.gl.DEPTH_BUFFER_BIT,
    )
  }
}

type Rectangle = {
  transform: Transform2D
  color: [number, number, number]
}

interface RectangleGenParams {
  xMax: number
  yMax: number
  scaleMax: Vec2
}

class RandomRectanglesScene extends Scene {
  private _program: Program
  private _vao: VertexArray
  private _geometry: GeometryData
  private _rects: Rectangle[]
  private _rectParams: RectangleGenParams

  constructor(ctx: RenderContext) {
    super(ctx, 'Random Rectangles', [0.5, 0.75, 0.125])

    this._program = this._ctx.createProgram('2d-default')
    this._vao = this._ctx.createVertexArray()
    this._geometry = Geometry.square()
    this._rects = []
    this._rectParams = {
      xMax: 120,
      yMax: 120,
      scaleMax: [2, 2],
    }

    this._uiComponents = [
      {
        type: 'slider',
        label: 'X Max',
        id: 'x-max',
        max: this._ctx.canvasSize[0] - this._rectParams.scaleMax[0] * 10,
        initialValue: this._rectParams.xMax,
        onInput: this._genSliderListener('x'),
      },
      {
        type: 'slider',
        label: 'Y Max',
        id: 'y-max',
        max: this._ctx.canvasSize[1] - this._rectParams.scaleMax[1] * 10,
        initialValue: this._rectParams.yMax,
        onInput: this._genSliderListener('y'),
      },
      {
        type: 'slider',
        label: 'Scale X',
        id: 'scale-x-max',
        max: 200,
        initialValue: this._rectParams.scaleMax[0],
        onInput: this._genSliderListener('scale-x'),
      },
      {
        type: 'slider',
        label: 'Scale Y',
        id: 'scale-y-max',
        max: 100,
        initialValue: this._rectParams.scaleMax[1],
        onInput: this._genSliderListener('scale-y'),
      },
    ]

    for (let i = 0; i < 50; i++)
      this._rects.push(this._genRandomRect(this._rectParams))
  }

  setup(ui: SimpleUI): void {
    super.setup(ui)

    this._program.link()

    this._vao.bind()
    this._program.use()

    this._vao.addVertexBuffer(this._geometry.vertexData)

    this._vao.vbos.entries().forEach(([_, { ptr }]) => {
      this._program.setupAttribPointer(ptr)
    })
  }

  update(): void {}

  override render(): void {
    super.render(0)

    this._program.use()
    this._vao.bind()

    this._rects.forEach((rect) => {
      let { width, height } = this._ctx.gl.canvas

      this._program.setUniform(
        'uModelProjection',
        rect.transform.getMatrix([width, height]),
      )

      this._program.setUniform(
        'uColor',
        rect.color[0],
        rect.color[1],
        rect.color[2],
      )
      this._ctx.gl.drawArrays(this._ctx.gl.TRIANGLES, 0, 6)
    })
  }

  private _genSliderListener(
    forInput: 'x' | 'y' | 'scale-x' | 'scale-y',
  ): (val: string) => any {
    return (value) => {
      this._rects = []

      switch (forInput) {
        case 'x':
          this._rectParams.xMax = Number.parseFloat(value)
          break
        case 'y':
          this._rectParams.yMax = Number.parseFloat(value)
          break
        case 'scale-x':
          this._rectParams.scaleMax[0] = Number.parseFloat(value)
          break
        case 'scale-y':
          this._rectParams.scaleMax[1] = Number.parseFloat(value)
          break
      }

      for (let i = 0; i < 50; i++)
        this._rects.push(this._genRandomRect(this._rectParams))
    }
  }

  private _genRandomRect = ({
    xMax,
    yMax,
    scaleMax: [sx, sy],
  }: RectangleGenParams): Rectangle => {
    const rng = (range: number) => Math.floor(Math.random() * range)
    const x = rng(xMax)
    const y = rng(yMax)
    const w = rng(sx)
    const h = rng(sy)

    const t = new Transform2D()

    t.translation[0] = x
    t.scale[0] = w
    t.translation[1] = y
    t.scale[1] = h

    return {
      transform: t,
      color: [Math.random(), Math.random(), Math.random()],
    }
  }
}

type FLetterVariant = 'simple' | 'hierarchy' | 'center-origin'

class FlatFLetterScene extends Scene {
  private _program: Program
  private _vao: VertexArray
  private _sceneVariant: FLetterVariant
  private _letterGeometry: GeometryData
  private _letterTransform: Transform2D
  private _translationDelta: [number, number]
  private _rectColor: Rgb

  constructor(ctx: RenderContext) {
    super(ctx, '2D F Letter', [0.5, 0.75, 0.125])

    this._program = this._ctx.createProgram('2d-default')
    this._vao = this._ctx.createVertexArray()
    this._sceneVariant = 'simple'
    this._letterGeometry = Geometry.FLetter2D()
    this._letterTransform = new Transform2D()
    this._translationDelta = [0, 0]
    this._rectColor = [Math.random(), Math.random(), Math.random()]

    this._uiComponents = [
      {
        type: 'slider',
        label: 'X Scale',
        id: 'x-scale',
        max: 100,
        initialValue: this._letterTransform.scale[0],
        onInput: (value) => {
          const xScale = Number.parseFloat(value) / 10
          this._letterTransform.scale[0] = xScale
        },
      },
      {
        type: 'slider',
        label: 'Y Scale',
        id: 'y-scale',
        max: 100,
        initialValue: this._letterTransform.scale[1],
        onInput: (value) => {
          const yScale = Number.parseFloat(value) / 10
          this._letterTransform.scale[1] = yScale
        },
      },
      {
        type: 'slider',
        label: 'Angle',
        id: 'angle',
        max: 360,
        onInput: (value) => {
          const degrees = Number.parseFloat(value)
          const radians = MathUtils.degreesToRadians(degrees)
          this._letterTransform.rotationDegrees = radians
        },
      },
      {
        type: 'group',
        id: 'scene-variant',
        legend: 'Scene Variant',
        components: [
          {
            type: 'radio',
            id: 'scene-variant-simple',
            name: 'scene-variant',
            label: 'Simple',
            value: 'simple',
            checked: true,
            onInput: (value) => (this._sceneVariant = value as FLetterVariant),
          },
          {
            type: 'radio',
            id: 'scene-variant-hierarchy',
            name: 'scene-variant',
            label: 'Hierarchy',
            value: 'hierarchy',
            onInput: (value) => (this._sceneVariant = value as FLetterVariant),
          },
          {
            type: 'radio',
            id: 'scene-variant-center-origin',
            name: 'scene-variant',
            label: 'Origin at center',
            value: 'center-origin',
            onInput: (value) => (this._sceneVariant = value as FLetterVariant),
          },
        ],
      },
    ]
  }

  setup(ui: SimpleUI): void {
    super.setup(ui)

    this._program.link()

    this._vao.bind()
    this._program.use()

    this._vao.addVertexBuffer(this._letterGeometry.vertexData)

    this._vao.vbos.entries().forEach(([_, { ptr }]) => {
      this._program.setupAttribPointer(ptr)
    })

    this._program.setUniform(
      'uColor',
      this._rectColor[0],
      this._rectColor[1],
      this._rectColor[2],
    )
  }

  update(e: Event): void {
    if (e.mouse.initialGrab) {
      this._translationDelta[0] = this._letterTransform.translation[0]
      this._translationDelta[1] = this._letterTransform.translation[1]
    }

    if (e.mouse.grabbed) {
      this._letterTransform.translation[0] =
        this._translationDelta[0] + e.mouse.movementX
      this._letterTransform.translation[1] =
        this._translationDelta[1] + e.mouse.movementY
    }
  }

  render(): void {
    super.render(0)

    this._program.use()
    this._vao.bind()

    switch (this._sceneVariant) {
      case 'simple': {
        let { width, height } = this._ctx.gl.canvas

        this._program.setUniform(
          'uModelProjection',
          this._letterTransform.getMatrix([width, height]),
        )

        this._ctx.gl.drawArrays(this._ctx.gl.TRIANGLES, 0, 18)
        break
      }

      case 'hierarchy': {
        const translation = Matrix3.translation(
          this._letterTransform.translation,
        )
        const rotation = Matrix3.rotation(this._letterTransform.rotationDegrees)
        const scale = Matrix3.scale(this._letterTransform.scale)

        let { width, height } = this._ctx.gl.canvas
        let modelProjection = Matrix3.orthographic([width, height])

        for (let i = 0; i < 5; i++) {
          modelProjection = modelProjection
            .multiply(translation)
            .multiply(rotation)
            .multiply(scale)

          this._program.setUniform('uModelProjection', modelProjection)
          this._ctx.gl.drawArrays(this._ctx.gl.TRIANGLES, 0, 18)
        }

        break
      }

      case 'center-origin': {
        let { width, height } = this._ctx.gl.canvas

        this._program.setUniform(
          'uModelProjection',
          this._letterTransform
            .getMatrix([width, height])
            .multiply(Matrix3.translation([-50, -75])),
        )

        this._ctx.gl.drawArrays(this._ctx.gl.TRIANGLES, 0, 18)
        break
      }
    }
  }
}

type ProjType = 'ortho' | 'perspective'

interface FLetter3DSceneBaseParams {
  program: Program
  sceneName: string
}

class FLetter3DSceneBase extends Scene {
  protected _program: Program
  protected _vao: VertexArray
  protected _orthoCamera: Matrix4
  protected _perspectiveCamera: Matrix4
  protected _letterGeometry: GeometryData
  protected _letterTransform: Transform3D
  protected _letterTransformAnimation: Transform3DAnimator
  protected _projType: ProjType

  constructor(
    ctx: RenderContext,
    { sceneName, program }: FLetter3DSceneBaseParams,
  ) {
    super(ctx, sceneName, [1, 1, 1])

    this._program = program
    this._vao = this._ctx.createVertexArray()
    this._letterGeometry = Geometry.FLetter3D()
    this._letterTransform = new Transform3D()
    this._letterTransformAnimation = new Transform3DAnimator(
      this._letterTransform,
    )
    this._projType = 'ortho'

    this._orthoCamera = Matrix4.orthographic({
      top: this._ctx.canvasSize[1] / 2,
      left: -this._ctx.canvasSize[0] / 2,
      right: this._ctx.canvasSize[0] / 2,
      bottom: -this._ctx.canvasSize[1] / 2,
      near: 1,
      far: 2000,
    })

    this._perspectiveCamera = Matrix4.perspective({
      fov: 75,
      aspect: this._ctx.canvasSize[0] / this._ctx.canvasSize[1],
      near: 1,
      far: 2000,
    })

    this._letterTransform.translation(0, 0, -1000)

    this._uiComponents = [
      {
        type: 'group',
        id: 'proj-type',
        legend: 'Projection Type',
        components: [
          {
            type: 'radio',
            id: 'proj-type-ortho',
            name: 'proj-type',
            label: 'Orthographic',
            value: 'ortho',
            checked: true,
            onInput: (value) => {
              this._projType = value as ProjType
            },
          },
          {
            type: 'radio',
            id: 'proj-type-perspective',
            name: 'proj-type',
            label: 'Perspective',
            value: 'perspective',
            onInput: (value) => {
              this._projType = value as ProjType
            },
          },
        ],
      },
    ]
  }

  setup(ui: SimpleUI): void {
    super.setup(ui)

    this._program.link()

    this._vao.bind()
    this._program.use()

    const vertexPtr = this._vao.addVertexBuffer(this._letterGeometry.vertexData)
    this._program.setupAttribPointer(vertexPtr)

    if (typeof this._letterGeometry.colorData != 'undefined') {
      const clrPtr = this._vao.addVertexBuffer(this._letterGeometry.colorData)
      this._program.setupAttribPointer(clrPtr)
    }
  }

  update(): void {}
}

class SingleFLetter3DScene extends FLetter3DSceneBase {
  private _cameraTransform: Transform3D

  private _boxProgram: Program
  private _boxVao: VertexArray
  private _boxGeometry: GeometryData
  private _boxTransform: Transform3D

  constructor(ctx: RenderContext) {
    super(ctx, {
      sceneName: '3D F Letter',
      program: ctx.createProgram('3d-lighting'),
    })

    this._cameraTransform = new Transform3D()

    this._boxProgram = ctx.createProgram('3d-default')
    this._boxVao = ctx.createVertexArray()
    this._boxGeometry = Geometry.Box()
    this._boxTransform = new Transform3D()

    this._boxTransform.scale(10, 10, 10)
    this._boxTransform.translation(0, 100, -900)

    const cameraUIFactory = this._cameraTransform.createUIFactory()
    const letterUIFactory = this._letterTransform.createUIFactory()

    this._uiComponents.push(cameraUIFactory.translationGroup('Camera'))
    this._uiComponents.push(letterUIFactory.translationGroup('Letter'))
    this._uiComponents.push(letterUIFactory.rotationGroup('Letter'))
    this._uiComponents.push(letterUIFactory.scaleGroup('Letter'))
  }

  override setup(ui: SimpleUI): void {
    super.setup(ui)

    this._boxProgram.link()

    this._boxProgram.use()
    this._boxVao.bind()
    const vertexPtr = this._boxVao.addVertexBuffer(this._boxGeometry.vertexData)
    this._program.setupAttribPointer(vertexPtr)

    if (this._boxGeometry.colorData) {
      const clrPtr = this._boxVao.addVertexBuffer(this._boxGeometry.colorData)
      this._program.setupAttribPointer(clrPtr)
    }

    this._program.use()

    this._program.setUniform(
      'uLightPos',
      this._boxTransform.tx,
      this._boxTransform.ty,
      this._boxTransform.tz,
    )

    this._vao.bind()

    if (typeof this._letterGeometry.normalData != 'undefined') {
      const normalPtr = this._vao.addVertexBuffer(
        this._letterGeometry.normalData,
      )
      this._program.setupAttribPointer(normalPtr)
    }
  }

  override render(): void {
    super.render(0)

    this._program.use()
    this._vao.bind()

    const viewMat = Matrix4.lookAt(
      new Vec3(this._cameraTransform.translation()),
      new Vec3(this._letterTransform.translation()),
      new Vec3([0, 1, 0]),
    ).inverse()

    const worldMat = this._letterTransform.worldMatrix()
    const worldInverseTransposeMat = worldMat.inverse().transpose()

    this._program.setUniform('uViewPos', ...this._cameraTransform.translation())

    this._program.setUniform('uWorld', worldMat)
    this._program.setUniform('uWorldInverseTranspose', worldInverseTransposeMat)

    this._program.setUniform(
      'uWorldProjection',
      this._computeProjection(worldMat, viewMat),
    )
    this._ctx.gl.drawArrays(this._ctx.gl.TRIANGLES, 0, 16 * 6)

    this._boxProgram.use()
    this._boxVao.bind()

    const boxMat = this._boxTransform.worldMatrix()
    this._boxProgram.setUniform(
      'uModelProjection',
      this._computeProjection(boxMat, viewMat),
    )
    this._ctx.gl.drawArrays(this._ctx.gl.TRIANGLES, 0, 36)
  }

  private _computeProjection(world: Matrix4, view: Matrix4): Matrix4 {
    switch (this._projType) {
      case 'ortho':
        return this._orthoCamera.multiply(view).multiply(world)

      case 'perspective':
        return this._perspectiveCamera.multiply(view).multiply(world)
    }
  }
}

type LookAt = 'origin' | 'f-letter'

class CircledFLetter3DScene extends FLetter3DSceneBase {
  private _cameraAngle: number
  private _cameraAngleIsAnimated: boolean
  private _cameraTranslation: Vec3
  private _lookAt: LookAt
  private _nLetters: number

  constructor(ctx: RenderContext) {
    super(ctx, {
      sceneName: '3D Letters in Circle',
      program: ctx.createProgram('3d-default'),
    })

    this._cameraAngle = 0
    this._cameraAngleIsAnimated = false
    this._cameraTranslation = new Vec3([0, 0, 0])
    this._lookAt = 'origin'
    this._nLetters = 5

    this._letterTransformAnimation.addAnimation({
      enabled: false,
      key: 'sy',
      speed: 0.2,
      func: 'wave',
    })

    this._uiComponents.push(
      {
        type: 'group',
        id: 'camera-controls',
        legend: 'Camera',
        components: [
          {
            type: 'slider',
            id: 'camera-angle',
            label: 'Angle',
            min: -360,
            max: 360,
            initialValue: this._cameraAngle,
            onInput: (value) => {
              this._cameraAngle = Number.parseFloat(value)
            },
          },
          {
            type: 'slider',
            id: 'x-pos',
            label: 'X Position',
            min: -this._ctx.canvasSize[0] / 2,
            max: this._ctx.canvasSize[0] / 2,
            initialValue: this._cameraTranslation.x(),
            onInput: (value) => {
              this._cameraTranslation.setX(Number.parseFloat(value))
            },
          },
          {
            type: 'slider',
            id: 'y-pos',
            label: 'Y Position',
            min: -this._ctx.canvasSize[1] / 2,
            max: this._ctx.canvasSize[1] / 2,
            initialValue: this._cameraTranslation.y(),
            onInput: (value) => {
              this._cameraTranslation.setY(Number.parseFloat(value))
            },
          },
          {
            type: 'slider',
            id: 'z-pos',
            label: 'Z Position',
            min: -this._ctx.canvasSize[1],
            max: this._ctx.canvasSize[1],
            initialValue: this._cameraTranslation.z(),
            onInput: (value) => {
              this._cameraTranslation.setZ(Number.parseFloat(value))
            },
          },
        ],
      },
      {
        type: 'group',
        id: 'animation',
        legend: 'Animation',
        components: [
          {
            type: 'checkbox',
            id: 'camera-angle-animate',
            label: 'Animate camera angle',
            onInput: (value) => {
              switch (value) {
                case 'true':
                  this._cameraAngleIsAnimated = true
                  break

                case 'false':
                  this._cameraAngleIsAnimated = false
                  break
              }
            },
          },
          {
            type: 'checkbox',
            id: 'letter-sy-animate',
            label: 'Animate Letter Y Scale',
            onInput: (value) => {
              switch (value) {
                case 'true':
                  this._letterTransformAnimation.animating('sy', true)
                  break

                case 'false':
                  this._letterTransformAnimation.animating('sy', false)
                  break
              }
            },
          },
        ],
      },
      {
        type: 'group',
        id: 'look-at',
        legend: 'Look At',
        components: [
          {
            type: 'radio',
            id: 'look-at-origin',
            name: 'look-at',
            label: 'Origin',
            value: 'origin',
            checked: true,
            onInput: (value) => {
              this._lookAt = value as LookAt
            },
          },
          {
            type: 'radio',
            id: 'look-at-f-letter',
            name: 'look-at',
            label: 'F letter',
            value: 'f-letter',
            onInput: (value) => {
              this._lookAt = value as LookAt
            },
          },
        ],
      },
      {
        type: 'slider',
        id: 'n-letters',
        label: 'Number of letters',
        min: 2,
        max: 16,
        initialValue: this._nLetters,
        onInput: (value) => {
          this._nLetters = Number.parseInt(value)
        },
      },
    )
  }

  override render(dt: number): void {
    super.render(0)

    this._program.use()
    this._vao.bind()

    this._letterTransformAnimation.animate(dt)

    if (this._cameraAngleIsAnimated) {
      const rotationSpeed = 15
      this._cameraAngle += rotationSpeed * dt
    }

    const radius = 200

    let viewMat
    switch (this._lookAt) {
      case 'origin':
        viewMat = Matrix4.yRotation(
          MathUtils.degreesToRadians(this._cameraAngle),
        )
          .translate(
            this._cameraTranslation.x(),
            this._cameraTranslation.y(),
            radius * 1.5 + this._cameraTranslation.z(),
          )
          .inverse()
        break

      case 'f-letter':
        const up = new Vec3([0, 1, 0])
        const letterPos = new Vec3([radius, 0, 0])

        const cameraView = Matrix4.yRotation(
          MathUtils.degreesToRadians(this._cameraAngle),
        ).translate(
          this._cameraTranslation.x(),
          this._cameraTranslation.y(),
          radius * 1.5 + this._cameraTranslation.z(),
        )

        const cameraPos = new Vec3([
          cameraView.buffer[12]!,
          cameraView.buffer[13]!,
          cameraView.buffer[14]!,
        ])

        viewMat = Matrix4.lookAt(cameraPos, letterPos, up).inverse()

        break
    }

    let projMat
    switch (this._projType) {
      case 'ortho':
        projMat = this._orthoCamera
        break

      case 'perspective':
        projMat = this._perspectiveCamera
        break
    }

    const viewProjMat = projMat.multiply(viewMat)

    for (let i = 0; i < this._nLetters; i++) {
      const angle = (i * Math.PI * 2) / this._nLetters

      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const mat = viewProjMat
        .translate(x, 0, z)
        .yRotate(-angle)
        .scale(1, this._letterTransform.sy, 1)
        .translate(-50, 75, 15)

      this._program.setUniform('uModelProjection', mat)
      this._ctx.gl.drawArrays(this._ctx.gl.TRIANGLES, 0, 16 * 6)
    }
  }
}

try {
  const canvasId = 'wgl2'
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement

  let initialX = 0
  let initialY = 0
  let movementX = 0
  let movementY = 0
  let initialGrab = false
  let grabbed = false

  canvas.addEventListener('mouseenter', (_) => {
    document.body.style.cursor = 'grab'
  })

  canvas.addEventListener('mouseleave', (_) => {
    document.body.style.cursor = 'default'
    grabbed = false
    initialX = 0
    initialY = 0
    movementX = 0
    movementY = 0
  })

  canvas.addEventListener('mousedown', (e) => {
    document.body.style.cursor = 'grabbing'

    initialGrab = true
    grabbed = true
    initialX = e.offsetX
    initialY = e.offsetY
  })

  canvas.addEventListener('click', (_) => {
    initialGrab = true
  })

  canvas.addEventListener('mouseup', (_) => {
    document.body.style.cursor = 'grab'
    initialGrab = false
    grabbed = false
    initialX = 0
    initialY = 0
    movementX = 0
    movementY = 0
  })

  canvas.addEventListener('mousemove', (e) => {
    if (grabbed) {
      initialGrab = false
      movementX = e.offsetX - initialX
      movementY = e.offsetY - initialY
    }
  })

  if (!canvas)
    throw new Error(`Failed to get canvas element by '${canvasId}' id`)

  const ctx = await RenderContext.create(canvas)

  ctx.gl.enable(ctx.gl.CULL_FACE)
  ctx.gl.enable(ctx.gl.DEPTH_TEST)

  const ui = new SimpleUI('ui-controls')
  let sceneIdx = 0
  const scenes: Scene[] = [
    new SingleFLetter3DScene(ctx) as Scene,
    new FlatFLetterScene(ctx) as Scene,
    new CircledFLetter3DScene(ctx) as Scene,
    new RandomRectanglesScene(ctx) as Scene,
  ]

  ui.mount({
    type: 'dropdown',
    id: 'scene-selection',
    label: 'Choose Scene',
    persist: true,
    options: scenes.map<{ name: string; value: string }>((scene, idx) => ({
      name: scene.name,
      value: idx.toString(),
    })),
    onInput: (value) => {
      scenes[sceneIdx]?.clearUi(ui)
      sceneIdx = Number.parseInt(value)
      scenes[sceneIdx]?.setup(ui)
    },
  })

  scenes[sceneIdx]?.setup(ui)

  let then = 0
  function draw(now: number) {
    ctx.resizeCanvas()

    scenes[sceneIdx]?.update({
      mouse: { initialGrab, grabbed, movementX, movementY },
    })

    now *= 0.001
    scenes[sceneIdx]?.render(now - then)

    then = now

    requestAnimationFrame(draw)
  }

  draw(0)
} catch (e) {
  // for iphone debugging
  alert(e)
}
