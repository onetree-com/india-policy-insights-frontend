import { getShortUrl } from "api/getShortUrl";
import queryString from "query-string";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const LinkRedirect = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleCopyLink = async () => {
    const abortController = new AbortController();
    const urlItems = pathname.split("/");

    const result: any = await getShortUrl({
      key: urlItems[urlItems.length - 1],
      controller: abortController,
    });
    const urlParts = result.url.split("?");

    const navigateTo: string = urlParts[0];
    const params = urlParts[1];
    const searchParams = queryString.parse(params);
    i18n.changeLanguage(searchParams.lang as string);

    navigate(navigateTo, {
      state: {
        map: searchParams.map,
        deciles: searchParams.deciles,
        decilesChange: searchParams.decilesChange,
        dataView: searchParams.dataView,
        lang: searchParams.lang,
        indIds: searchParams.indIds,
        indId: searchParams.indId,
        subregionId: searchParams.subregionId,
        subregionIds: searchParams.subregionIds,
      },
    });
  };

  useEffect(() => {
    handleCopyLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Redirecting...</div>;
};

export default LinkRedirect;
