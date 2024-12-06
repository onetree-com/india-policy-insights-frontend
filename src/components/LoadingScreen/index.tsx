import styles from "components/LoadingScreen/styles.module.scss";
import ProgressBar from "components/ProgressBar";
import { FC, useContext } from "react";
import { GlobalContext } from "context/globalContext";

interface Props {
  loading?: boolean;
}

const LoadingScreen: FC<Props> = ({ loading }) => {
  const { globalState } = useContext(GlobalContext)!;

  return (
    <div className={styles.loaderContainer}>
      {(globalState.loading || loading) && (
        <div className={styles.loader}>
          <ProgressBar />
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
