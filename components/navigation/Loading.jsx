import { useLoading } from "@rngstudio/flip";

import styles from "./Loading.module.css";

export const Loading = () => {
  const loading = useLoading();

  if (!loading) {
    return <div></div>;
  }

  return (
    <div className={styles.loading}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
