import AddIcon from "assets/icons/AddIcon";
import EditIcon from "assets/icons/EditIcon";
import IconContainer from "components/IconContainer";
import styles from "components/StateDistrictFilter/styles.module.scss";
import Text from "components/Text";
import ToogleSwitch from "components/ToogleSwitch";
import { CompareActionType } from "context/compareContext/index";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { division } from "models/divisions";
import { Dispatch, FC, useContext, useEffect, useState } from "react";
import { MediaQueries } from "utils/media-queries";
import ModalDivisions from "../Modal/ModalDivisions";
import VillageSelectionModal from "./VillageSelectionModal";
import DeepDiveVillageModal from "components/DeepDiveVillageModal";
import { FeatureKeyRoute } from "models/features";
import CreateReportVillageModal from "components/CreateReportVillageModal";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const StateDistrictFilter: FC<{
  isPending?: boolean;
  showEditDivision?: boolean;
  toggleEditDivision?: any;
  divisionIndex?: { name: string; index: number } | null;
  dispatch?: Dispatch<{ type: CompareActionType; payload: any }>;
  selectedDivision?: {
    parent: { id: number; name: string };
    division: division;
  };
  selectedDivisions?: {
    parent: { id: number; name: string };
    division: division;
  }[];
}> = ({
  isPending,
  showEditDivision,
  toggleEditDivision,
  divisionIndex,
  dispatch,
  selectedDivision,
  selectedDivisions,
}) => {
  const { globalState, globalDispatch } = useContext(GlobalContext)!;
  const { pathname } = useLocation();
  const featureName = pathname.split("/")[1];
  const [
    filterByAspirationalDistrictsActive,
    setFilterByAspirationalDistrictsActive,
  ] = useState<boolean>(false);
  const [searchDivisions, setSearchDivisions] = useState<string>("");
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const [showModal, setShowModal] = useState<boolean>(
    window.location.search.split("=")[1] === "Village"
  );
  const { t, i18n } = useTranslation();

  const divisionType =
    globalState.divisionType === DivisionTypes.District
      ? globalState.divisionType.slice(0, -1)
      : globalState.divisionType;

  useEffect(() => {
    if (showModal) {
      setSearchDivisions("");
    }
  }, [showModal]);

  //Only way that I found of getting modal to automatically display is based of off URL, should work with globalState.divisionType but does not update upon context generation
  const title = (
    <Text
      color="#3d4247"
      weight={300}
      lineHeight="11px"
      size="10px"
      style={{
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        marginBottom: 8,
      }}>
      State-District Filter
    </Text>
  );

  const deepDiveTitle = () => {
    const keys: { [key in DivisionTypes]: string } = {
      [DivisionTypes.Assembly_Constituencies]: `${t(
        globalState.divisionType
      )} ${t("filter")}`,
      [DivisionTypes.Parlimentary_Constituencies]: `${t(
        globalState.divisionType
      )} ${t("filter")}`,
      [DivisionTypes.District]: `${t("state")}-${t("District")} ${t("filter")}`,
      [DivisionTypes.Village]: `${t("District")}-${t("Village")} ${t(
        "filter"
      )}`,
    };
    return keys[globalState.divisionType];
  };

  const deepDiveAndCreateReportPlaceholder = () => {
    if (globalState.divisionType === DivisionTypes.Village) {
      if (selectedDivision && Object.keys(selectedDivision)) {
        return selectedDivision?.division?.name;
      } else {
        return t("select") + t("a") + " " + t("village");
      }
    } else {
      if (
        globalState.selectedDivision &&
        Object.keys(globalState.selectedDivision).length !== 0
      ) {
        return globalState.selectedDivision!.division?.name!;
      } else {
        if (i18n.language === "en") {
          return (
            t("select") +
            `${
              globalState.divisionType !== DivisionTypes.Assembly_Constituencies
                ? t("a")
                : t("an")
            } ${((t(divisionType) as string) ?? "").replace("ies", "y")}`
          );
        } else {
          return `${((t(divisionType) as string) ?? "").replace(
            "ies",
            "y"
          )} ${t("select")}`;
        }
      }
    }
  };
  return (
    <>
      {globalState.navigation.feature === "ATLAS" && (
        <div className={styles.container}>
          {title}
          <div className={styles["filter-districts-view"]}>
            <Text weight={300} color="#5E6771" size="14px" lineHeight="24px">
              State-District Filter
            </Text>
            <IconContainer onClick={(): void => setShowModal(true)}>
              <AddIcon />
            </IconContainer>
          </div>
          <div className={styles["filter-aspirational-districts"]}>
            <Text weight={300} color="#5E6771" size="12px" lineHeight="17px">
              {t("filter_aspirational")}
            </Text>
            <ToogleSwitch
              value={filterByAspirationalDistrictsActive}
              customSetter={setFilterByAspirationalDistrictsActive}
            />
          </div>
        </div>
      )}
      {globalState.navigation.feature === "RANKING" && (
        <div className={styles.rankingContainer}>
          {title}
          <Selector
            setShowModal={setShowModal}
            placeholder="Filter districts view"
          />
        </div>
      )}
      {globalState.navigation.feature === "DEEP_DIVE" ? (
        <div className={`${styles.container} ${styles.rankingContainer}`}>
          <Text
            color="#3d4247"
            weight={300}
            lineHeight="11px"
            size="10px"
            style={{ marginBottom: 8, textTransform: "uppercase" }}>
            {deepDiveTitle()}
          </Text>
          <Selector
            setShowModal={setShowModal}
            placeholder={deepDiveAndCreateReportPlaceholder()}
            focus={
              globalState.selectedDivision &&
              Object.keys(globalState.selectedDivision!).length !== 0
                ? false
                : true
            }
            iconType={
              (globalState.divisionType !== DivisionTypes.Village &&
                globalState.selectedDivision &&
                Object.keys(globalState.selectedDivision!).length !== 0) ||
              (selectedDivision && Object.keys(selectedDivision).length !== 0)
                ? "edit"
                : "add"
            }
          />
        </div>
      ) : null}
      {globalState.navigation.feature === "COMPARE" &&
      showEditDivision === undefined ? (
        !isDesktop ? (
          <div
            onClick={() => {
              setShowModal(!showModal);
            }}
            className={styles.addSelectorMobile}>
            <span>{`${globalState.divisionType}`}</span>
            <AddIcon color="#3D4247" />
          </div>
        ) : (
          <div
            onClick={() => {
              setShowModal(!showModal);
            }}
            className={styles.addSelector}>
            <Text
              className={styles.input}
              size="13.5px"
              weight={250}
              style={{
                width: "90%",
                cursor: "pointer",
                whiteSpace: "pre-wrap",
                pointerEvents: "none",
                color: "#757575",
              }}>
              {t("add") + ` ${t(globalState.divisionType)}`}
            </Text>
            <IconContainer background="#e7e7e7">
              <AddIcon />
            </IconContainer>
          </div>
        )
      ) : null}
      {globalState.navigation.feature === "CREATE_REPORT" ? (
        <div
          className={`${styles.CreateReportContainer} ${styles.rankingContainer}`}>
          <Text
            weight={300}
            color="#3D4247"
            size="10px"
            lineHeight="11px"
            style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>
            {t(globalState.divisionType)}
          </Text>
          <Selector
            setShowModal={setShowModal}
            placeholder={deepDiveAndCreateReportPlaceholder()}
          />
        </div>
      ) : null}
      {globalState.divisionType === DivisionTypes.Village && !divisionIndex ? (
        <>
          {globalState.navigation.feature === FeatureKeyRoute.COMPARE && (
            <VillageSelectionModal
              showModal={showModal}
              setShowModal={setShowModal}
            />
          )}
          {globalState.navigation.feature === FeatureKeyRoute.CREATE_REPORT &&
            featureName === "create-report" && (
              <CreateReportVillageModal
                showModal={showModal}
                setShowModal={setShowModal}
              />
            )}

          {globalState.navigation.feature === FeatureKeyRoute.DEEP_DIVE &&
            featureName === "deep-dive" && (
              <DeepDiveVillageModal
                showModal={showModal}
                setShowModal={setShowModal}
              />
            )}
        </>
      ) : (
        <ModalDivisions
          selectedDivision={
            divisionIndex
              ? divisionIndex.name
              : globalState.selectedDivision?.division?.name
          }
          show={showEditDivision ? showEditDivision : showModal}
          setSearchDivisions={setSearchDivisions}
          searchDivisions={searchDivisions}
          showFilterByAspirationalDistricts={
            globalState.divisionType === DivisionTypes.District ? true : false
          }
          divisionIndex={divisionIndex}
          selectedDivisions={selectedDivisions}
          filterByAspirationalDistricts={filterByAspirationalDistrictsActive}
          setFilterByAspirationalDistricts={
            setFilterByAspirationalDistrictsActive
          }
          loading={isPending}
          onClose={() => {
            showEditDivision ? toggleEditDivision() : setShowModal(false);
          }}
          dispatch={dispatch ?? globalDispatch}
        />
      )}
    </>
  );
};

export const Selector: FC<{
  placeholder: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  focus?: boolean;
  iconType?: "add" | "edit";
  htmlTitle?: string;
}> = ({ placeholder, setShowModal, focus, iconType, htmlTitle }) => {
  const { t } = useTranslation();
  return (
    <div
      title={htmlTitle}
      id={`selector-${
        placeholder ? placeholder.replaceAll(" ", "-").toLowerCase() : ""
      }`}
      onClick={(): void => setShowModal(true)}
      className={`${styles.selector} ${
        focus && iconType === "add" ? styles.focus : null
      }`}
      onFocusCapture={(e) => e.currentTarget.classList.remove(styles.focus)}
      onBlur={(e) => e.currentTarget.classList.remove(styles.focus)}>
      <Text
        className={styles.input}
        size="13.5px"
        weight={250}
        style={{ width: "90%", cursor: "pointer", whiteSpace: "pre-wrap" }}>
        {t(placeholder)}
      </Text>
      <IconContainer>
        {iconType === "add" ? <AddIcon /> : <EditIcon />}
      </IconContainer>
    </div>
  );
};

export default StateDistrictFilter;
