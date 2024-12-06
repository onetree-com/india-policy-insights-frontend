import ExpandDown from "assets/icons/ExpandDown";
import ExpandUp from "assets/icons/ExpandUp";
import styles from "components/PopulationProfile/styles.module.scss";
import Text from "components/Text";
import { DivisionTypes, GlobalContext } from "context/globalContext";
import useMediaQuery from "hooks/use-media-query";
import { FC, useContext, useEffect, useState } from "react";
import { MediaQueries } from "utils/media-queries";
import { getRegionDemographics } from "../../api/getRegionDemographics";
import { useTranslation } from "react-i18next";

const PopulationProfile: FC<{ districtName?: string }> = ({ districtName }) => {
  const isDesktop = useMediaQuery(MediaQueries.DESKTOP);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [data, setData] = useState<{
    population: number;
    density: number;
    female: number;
    male: number;
    urban: number;
    literate: number;
    sexRatio: number;
  } | null>(null);
  const { globalState } = useContext(GlobalContext)!;
  const { t } = useTranslation();
  useEffect(() => {
    const abortController = new AbortController();
    const getData = async () => {
      try {
        const data = await getRegionDemographics<{
          id: number;
          regionId: number;
          population: number;
          density: number;
          female: number;
          male: number;
          urban: number;
          literate: number;
          sexRatio: number;
        }>({
          RegionType: globalState.divisionType,
          RegionId:
            globalState.divisionType !== DivisionTypes.Village
              ? globalState.selectedDivision?.division.id!
              : globalState.selectedDivision?.village?.id!,
          controller: abortController,
        });
        const { id, regionId, ...rest } = data;
        setData(rest);
      } catch (error) {}
    };
    getData();
    return () => {
      abortController.abort();
    };
  }, [globalState.selectedDivision, globalState.divisionType]);

  const content = (
    <div className={styles.container}>
      {isDesktop ? (
        <div className={styles.titleContainer}>
          <Text size="14px" weight={400} lineHeight="24px" color="#A51C30">
            {t("population_profile")}
          </Text>
        </div>
      ) : null}
      <div className={styles.informationContainer}>
        <div className={styles.information}>
          <Text size="12px" lineHeight="32px" weight={300} color="#3D4247">
            {t("total_population")}
          </Text>
          <Text size="14px" lineHeight="32px" weight={400} color="#3D4247">
            {data ? data.population.toLocaleString() : t("no_data")}
          </Text>
        </div>
        <div className={styles.information}>
          <Text size="12px" lineHeight="32px" weight={300} color="#3D4247">
            {t("population_density")}
          </Text>
          <Text size="14px" lineHeight="32px" weight={400} color="#3D4247">
            {data ? data.density : t("no_data")}
          </Text>
        </div>
        <div className={styles.information}>
          <Text size="12px" lineHeight="32px" weight={300} color="#3D4247">
            {t("sex_ratio")}
          </Text>
          <Text size="14px" lineHeight="32px" weight={400} color="#3D4247">
            {data
              ? `${data.sexRatio} ` + t("females") + " / 1000 " + t("males")
              : t("no_data")}
          </Text>
        </div>
        <div className={styles.information}>
          <Text size="12px" lineHeight="32px" weight={300} color="#3D4247">
            {t("urban_percent")}
          </Text>
          <Text size="14px" lineHeight="32px" weight={400} color="#3D4247">
            {data ? data.urban : t("no_data")}
          </Text>
        </div>
      </div>
    </div>
  );
  return isDesktop ? (
    content
  ) : (
    <div>
      <div
        onClick={() => {
          setExpanded(!expanded);
        }}
        className={styles.header}>
        {expanded ? (
          <>
            <Text size="14px" lineHeight="16.8px" weight={400}>
              Hide Population Profile for All India
            </Text>
            <ExpandUp />
          </>
        ) : (
          <>
            <Text size="14px" lineHeight="16.8px" weight={400}>
              Show Population Profile for All India
            </Text>
            <ExpandDown color="#242328" />
          </>
        )}
      </div>
      {expanded ? content : null}
    </div>
  );
};

export default PopulationProfile;
