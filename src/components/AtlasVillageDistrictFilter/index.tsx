import { FC, useContext, useState, useEffect } from "react";
import IconContainer from "components/IconContainer";
import styles from "components/StateDistrictFilter/styles.module.scss";
import Text from "components/Text";
import { GlobalActionType, GlobalContext } from "context/globalContext";
import AtlasVillageDistrictModal from "components/AtlasVillageDistrictModal";
import { useTranslation } from "react-i18next";
import EditIcon from "assets/icons/EditIcon";

const AtlasVillageDistrictFilter: FC = () => {
  const { globalState, globalDispatch } = useContext(GlobalContext)!;
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(true);

  useEffect(() => {
    if (!showModal) {
      setTimeout(
        () =>
          globalDispatch({
            type: GlobalActionType.SET_MODAL,
            payload: showModal,
          }),
        1000
      );
      return;
    }
    globalDispatch({
      type: GlobalActionType.SET_MODAL,
      payload: showModal,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  useEffect(() => {
    if (globalState.fromLink) {
      setShowModal(!globalState.fromLink);
    }
  }, [globalState.fromLink]);

  return (
    <>
      <div className={styles.container}>
        <Text
          color="#3d4247"
          weight={300}
          lineHeight="11px"
          size="10px"
          style={{
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
          {t("state_district_filter")}
        </Text>

        <div
          className={styles["filter-districts-view"]}
          onClick={(): void => {
            setShowModal(true);
          }}
          style={{
            cursor: "pointer",
          }}>
          {globalState.selectedDivision && (
            <Text weight={300} color="#5E6771" size="14px" lineHeight="24px">
              {`${globalState.selectedDivision?.division?.name}, ${globalState.selectedDivision?.stateAbbreviation}`}
            </Text>
          )}
          <IconContainer>
            <EditIcon />
          </IconContainer>
        </div>
      </div>
      <AtlasVillageDistrictModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};

export default AtlasVillageDistrictFilter;
