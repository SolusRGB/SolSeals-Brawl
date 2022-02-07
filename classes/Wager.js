export class Wager {
  constructor(properties) {
    Object.keys(properties).forEach((key) => {
      this[key] = properties[key];
    });
  }
  static schema = new Map([
    [
        Wager,
      {
        kind: "struct",
        fields: [
          ["type", "u8"],
          ["better", [32]],
          ["bet", [32]],
          ["amount", "u64"],
          ["updated_at", "u64"],
        ],
      },
    ],
  ]);
}