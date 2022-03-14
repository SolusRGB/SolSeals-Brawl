import BN from "bn.js";

const getTimeCount = (array) => {
  return array
    .reduce((total, a) => total.add(a.updated_at), new BN(0))
    .toString();
};

export default getTimeCount;
