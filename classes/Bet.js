export class Bet {
    constructor(properties) {
      Object.keys(properties).forEach((key) => {
        this[key] = properties[key];
      });
    }
    static schema = new Map([
      [
          Bet,
        {
          kind: "struct",
          fields: [
            ["type", "u8"],
            ["winner", [32]],
            ["loser", [32]],
            ["amount", "u64"],
            ["collected", "u8"],
            ["updated_at", "u64"],
          ],
        },
      ],
    ]);
  }