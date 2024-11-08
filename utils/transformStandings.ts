import _ from "lodash";

export const transformStandings = (data: any) => {
  const table = _.get(data, ["standings", 0, "table"], []);

  return table;
};
