import { FC, useContext, useState, useEffect } from "react";
import AddIcon from "assets/icons/AddIcon";
import IconContainer from "components/IconContainer";
import styles from "components/StateDistrictFilter/styles.module.scss";
import Text from "components/Text";
import { AtlasActionType, AtlasContext } from "context/atlasContext";
import {
  DivisionTypes,
  GlobalActionType,
  GlobalContext,
} from "context/globalContext";
import { division } from "models/divisions";
import AtlasVillageModal from "components/AtlasVillageModal";
import { getDivisions } from "api/divisions";
import { useTranslation } from "react-i18next";

const AtlasVillageFilter: FC = () => {
  const { globalState, globalDispatch } = useContext(GlobalContext)!;
  const { atlasState, atlasDispatch } = useContext(AtlasContext)!;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedVillages, setSelectedVillages] = useState<division[]>([]);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

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

  useEffect(
    () => {
      if (!globalState.selectedDivision) return;

      let controller = new AbortController();

      (async () => {
        const data = await getDivisions({
          RegCount: 5000,
          RegIgnored: 0,
          RegionType: DivisionTypes.Village,
          StateId: 0,
          RegionID: globalState.selectedDivision?.division.id!,
          SubregionID: 0,
          controller,
          currentLanguage,
        });
        atlasDispatch({
          type: AtlasActionType.SET_ALL_DISTRICT_VILLAGES,
          payload: data,
        });
      })();

      return () => {
        controller?.abort();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalState.selectedDivision, currentLanguage]
  );

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
          {`Villages Filter`}
        </Text>

        <div
          className={styles["filter-districts-view"]}
          onClick={(): void => {
            setShowModal(true);
          }}
          style={{
            cursor: "pointer",
          }}>
          {atlasState.selectedDivisions && (
            <Text weight={300} color="#5E6771" size="14px" lineHeight="24px">
              {`${
                selectedVillages.length || atlasState.selectedDivisions.length
              } villages selected`}
            </Text>
          )}
          <IconContainer>
            <AddIcon />
          </IconContainer>
        </div>
      </div>
      <AtlasVillageModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedVillages={selectedVillages}
        setSelectedVillages={setSelectedVillages}
      />
    </>
  );
};

export default AtlasVillageFilter;
