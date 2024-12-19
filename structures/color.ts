class Color {
  public r: number = 0;
  public g: number = 0;
  public b: number = 0;

  public constructor(red: number, green: number, blue: number) {
    this.r = red;
    this.g = green;
    this.b = blue;
  }

  public toInt(): number {
    return (this.r << 16) | (this.g << 8) | this.b;
  }
  public static fromInt(color: number): Color {
    return new Color((color >> 16) & 255, (color >> 8) & 255, color & 255);
  }

  public static fromHexString(hexString: string): Color {
    return this.fromInt(parseInt(hexString.replace('#', ''), 16));
  }

  public static fromHex(hex: number): Color {
    return this.fromInt(hex);
  }
}

export { Color };
