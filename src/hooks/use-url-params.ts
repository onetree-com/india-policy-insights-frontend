import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";

const useUrlParams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = queryString.parse(window.location.search);

  const navigateParams = (params: any) => {
    const stringified = queryString.stringify(params);
    navigate(`${location.pathname}?${stringified}`);
  };

  return { searchParams: searchParams, navigateParams };
};

export default useUrlParams;
