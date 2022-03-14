export class Argument {
    constructor(properties) {
      Object.keys(properties).forEach((key) => {
        this[key] = properties[key];
      });
    }
    static schema = new Map([
      [
          Argument,
        {
          kind: "struct",
          fields: [
            ["type", "u8"],
            ["amount", "u64"],
          ],
        },
      ],
    ]);
  }