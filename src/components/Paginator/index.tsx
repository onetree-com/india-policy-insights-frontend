import React, { FC, useContext } from "react";
import styles from "components/Paginator/styles.module.scss";
import Text from "components/Text";
import ArrowPlayRight from "assets/icons/ArrowPlayRight";
import { CreateReportContext } from "context/createReportContext";

const Paginator: FC<{
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}> = ({ setPage, page }) => {
  const { state } = useContext(CreateReportContext)!;
  return (
    <div className={styles.PDFPaginator}>
      <button
        className={styles.arrows}
        onClick={() => {
          setPage(page! > 0 ? page! - 1 : page);
        }}>
        <ArrowPlayRight
          style={{
            transform: "scaleX(-1)",
          }}
        />
      </button>
      {Array.from(Array(state.selectedIndicators.length)).map((item, index) => {
        return index >= page - 3 &&
          index < page + 2 &&
          index !== state.selectedIndicators.length - 1 ? (
          <button
            key={index}
            className={`${
              page === index + 1 ? styles.active : styles.notActive
            }`}
            onClick={() => {
              setPage(index + 1);
            }}>
            <Text size="12px" weight={400} lineHeight="13.8px">
              {index + 1}
            </Text>
          </button>
        ) : null;
      })}

      {page < state.selectedIndicators.length - 3 &&
      state.selectedIndicators.length > 7 ? (
        <Text
          size="12px"
          className={styles.ellipsis}
          weight={400}
          lineHeight="15.08px">
          ...
        </Text>
      ) : null}

      <button
        className={`${
          page === state.selectedIndicators.length
            ? styles.active
            : styles.notActive
        }`}
        onClick={() => {
          setPage(state.selectedIndicators.length);
        }}>
        <Text size="12px" weight={400} lineHeight="13.8px">
          {state.selectedIndicators.length}
        </Text>
      </button>

      <button
        className={styles.arrows}
        onClick={() => {
          setPage(page! + 1);
        }}>
        <ArrowPlayRight />
      </button>
    </div>
  );
};

export default Paginator;
