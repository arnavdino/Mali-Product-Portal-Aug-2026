import { useCallback, useEffect, useRef, useState } from "react";
import { FaDotCircle } from "react-icons/fa";
import {
  LineChart,
  XAxis,
  Tooltip,
  Line,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAuth } from "../../providers/auth";
import { get } from "../../util/generalActions";
import moment from "moment";
import { CURRENCY } from "../../util/config";

interface FeaturedAnalytics {
  name: string;
  imageUrl: string;
  id: string;
  parent: string;
  price: number;
  unit: string;
}

interface Transaction {
  fname: string;
  lname: string;
  productName: string;
  date: Date;
}
interface ActiveProduct {
  name: string;
  prev: number;
  cur: number;
}

interface PieData {
  name: string;
  value: number;
}

const safeNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const Main: React.FC = () => {
  const [height, setHeight] = useState(null);
  const [featured, setFeatured] = useState<FeaturedAnalytics[]>([]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [width, setWidth] = useState(null);
  const [width2, setWidth2] = useState(null);
  const [height2, setHeight2] = useState(null);
  const [width3, setWidth3] = useState(null);
  const [height3, setHeight3] = useState(null);
  const [sales, setSales] = useState({
    loading: true,
    data: [],
    year1: "",
    year2: "",
  });
  const [revenue, setRevenue] = useState<{ loading: boolean; data: PieData[] }>(
    { loading: true, data: [] }
  );
  const [active, setActive] = useState<{
    loading: boolean;
    data: ActiveProduct[];
  }>({ loading: true, data: [] });
  const divRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);
  const divRef2 = useCallback((node) => {
    if (node !== null) {
      setHeight2(node.getBoundingClientRect().height);
      setWidth2(node.getBoundingClientRect().width);
    }
  }, []);
  const divRef3 = useCallback((node) => {
    if (node !== null) {
      setHeight3(node.getBoundingClientRect().height);
      setWidth3(node.getBoundingClientRect().width);
    }
  }, []);
  const { token, profile } = useAuth();
  const ref = useRef();
  const COLORS = ["#90FFF8", "#FF3C3C", "#FFF400", "#FF9900", "#B9EA25"];

  useEffect(() => {
    if (token && profile) {
      get<{ data: FeaturedAnalytics[] }>(
        "/admin/analytics/featured",
        token || ""
      ).then((res) => setFeatured(res.data));

      get<{ data: Transaction[] }>(
        "/admin/analytics/transactions",
        token || ""
      ).then((res) => setTransactions(res.data));

      get<{ data: ActiveProduct[] }>(
        "/admin/analytics/active",
        token || ""
      ).then((res) => setActive({ loading: false, data: res.data }));

      get<{ data: PieData[] }>(
        "/admin/analytics/revenueSummary",
        token || ""
      ).then((res) => {
        res.data.forEach((x) => {
          x.value = parseFloat(x.value.toString());
        });
        setRevenue({ loading: false, data: res.data });
      });

      get<{ data: { data: any; thisYear: string; lastYear: string } }>(
        "/admin/analytics/last12",
        token || ""
      ).then((res) =>
        setSales({
          loading: false,
          data: res.data.data,
          year1: res.data.thisYear,
          year2: res.data.lastYear,
        })
      );
    }
  }, [token, profile]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{ borderRadius: 30 }}
          className="flex flex-col bg-green p-4 text-14"
        >
          <b className="mb-2">{label}</b>
          <span className="px-10">
            {CURRENCY}
            {safeNumber(payload[0]?.payload?.cur).toFixed(2)}
          </span>
        </div>
      );
    }

    return null;
  };

  const CustomTooltipPie = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{ borderRadius: 30 }}
          className="flex flex-col bg-green p-4 text-14"
        >
          {payload[0]?.name} {CURRENCY}
          {safeNumber(payload[0]?.value).toFixed(2)}
        </div>
      );
    }

    return null;
  };

  const CategoryTick = (props: any) => {
    return (
      <foreignObject
        x={props.x - 10}
        y={props.y}
        className="flex flex-col"
        height={30}
        width={50}
      >
        <span className="text-10 green">{props?.payload?.value}</span>
      </foreignObject>
    );
  };
  return (
    <div className="relative  overflow-hidden bottom-height-no-toolbar bg-black">
      <div className="h-1/2 border-b-4 border-green p-4 flex flex-row ">
        <div
          ref={divRef}
          className=" bg-main rounded-2xl border border-green h-full mr-2 p-4 flex flex-col"
          style={{ width: "77%" }}
        >
          <div className="text-left green font-bold text-20">
            Sales Activity
          </div>
          <div className="flex flex-row">
            <div className="text-left green font-bold mt-4 text-16 flex flex-row mr-6">
              <FaDotCircle className="w-2 mr-2 mt-1" /> This Year
            </div>
          </div>
          {width != null && height != null && !sales.loading && (
            <div className="plot-parent flex flex-row justify-center mt-4">
              <LineChart
                width={width - 50}
                height={height - 100}
                data={sales.data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid horizontal={false} stroke="#B9EA25" />
                <XAxis
                  dataKey="name"
                  stroke="#B9EA25"
                  tickLine={false}
                  padding={"gap"}
                  axisLine={false}
                  fontFamily="Nunito"
                  fontWeight={700}
                  fontSize={14}
                />
                <YAxis
                  stroke="#B9EA25"
                  tickLine={false}
                  axisLine={false}
                  fontFamily="Nunito"
                  fontWeight={700}
                  fontSize={14}
                />
                <Tooltip
                  cursor={true}
                  content={CustomTooltip}
                  wrapperStyle={{
                    backgroundColor: "#B9EA25",
                    borderRadius: "30px",
                    height: 100,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={sales.year1}
                  stroke="#B9EA25"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={sales.year2}
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </div>
          )}
        </div>
        <div
          style={{ width: "23%" }}
          className=" bg-main rounded-2xl border border-green h-full xl:p-4 p-2 flex flex-col items-start overflow-auto style-2"
        >
          {" "}
          <div className="text-left green font-bold xl:text-20 text-18">
            Featured Products
          </div>
          {featured.map((f) => (
            <div className="my-2 green flex flex-row w-full xl:text-12  text-10 font-bold">
              <div
                style={{ height: 62, width: 57, borderRadius: 20 }}
                className="p-3 border border-green rounded-xl flex flex-col items-center justify-center bg-green mr-2 shrink-0"
              >
                <img src={f.imageUrl} />
              </div>
              <div className="flex flex-col p-1 w-full items-start justify-center">
                <div className="flex flex-row w-full justify-start">
                  <div className="flex flex-col items-start w-full">
                    <div className="font-bold">{f.parent}</div>
                    <div className="flex flex-row justify-between w-full text-10">
                      <span>{f.name}</span>
                      <span>
                        {CURRENCY}
                        {safeNumber(f.price).toFixed(2)}/{f.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-1/2  p-4 flex flex-row">
        <div style={{ width: "77%" }} className=" h-full mr-2 flex flex-row">
          <div
            ref={divRef2}
            style={{ width: "60%" }}
            className="bg-main rounded-2xl border border-green h-full mr-2 p-4 flex flex-col"
          >
            {" "}
            <div className="text-left green font-bold text-20">
              Active Products
            </div>
            <div className="flex flex-row">
              <div className="text-left green font-bold mt-4 text-16 flex flex-row mr-6">
                <FaDotCircle className="w-2 mr-2 mt-1" /> This Month
              </div>
              <div className="text-left text-white font-bold mt-4 text-16 flex flex-row">
                <FaDotCircle className="w-2 mr-2 mt-1" /> Last Month
              </div>
            </div>
            <div className="flex felx-row justify-center mt-4">
              {width2 && height2 && !active.loading && (
                <BarChart
                  width={width2 - 30}
                  height={height2 - 140}
                  data={active.data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid vertical={false} stroke="#B9EA25" />
                  <XAxis
                    dataKey="name"
                    stroke="#B9EA25"
                    tickLine={false}
                    axisLine={false}
                    fontFamily="Nunito"
                    fontWeight={700}
                    fontSize={12}
                    tick={CategoryTick}
                    interval={0}
                  />
                  <YAxis
                    stroke="#B9EA25"
                    tickLine={false}
                    axisLine={false}
                    fontFamily="Nunito"
                    fontWeight={700}
                    fontSize={12}
                    interval={0}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="prev"
                    barSize={27}
                    fill="white"
                    radius={[30, 30, 0, 0]}
                  />
                  <Bar
                    dataKey="cur"
                    barSize={27}
                    fill="#B9EA25"
                    radius={[30, 30, 0, 0]}
                  />
                </BarChart>
              )}
            </div>
          </div>
          <div
            ref={divRef3}
            style={{ width: "40%" }}
            className="bg-main rounded-2xl border border-green  h-full p-4 flex flex-col pie-chart"
          >
            <div className="text-left green font-bold text-20">
              Revenue Summary
            </div>
            {width3 && height3 && !revenue.loading && (
              <PieChart width={width3 - 50} height={height3 - 80}>
                <Pie
                  data={revenue.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {revenue.data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={CustomTooltipPie} />
                <Legend />
              </PieChart>
            )}
          </div>
        </div>
        <div style={{ width: "23%" }} className="relative">
          <div
            ref={ref as any}
            className="w-full bg-main rounded-2xl border border-green h-full p-4 overflow-auto style-2 flex flex-col"
          >
            {" "}
            <div className="text-left green font-bold text-20">
              Latest Transactions
            </div>
            {transactions.length > 0 ? (
              transactions.map((t, _idx) => (
                <div
                  className={`border-b border-green mt-4 pb-2 text-12 w-full green ${
                    _idx == transactions.length - 1 ? "mb-12" : ""
                  }`}
                >
                  <div className="flex flex-row justify-start">
                    <div
                      style={{ height: 23, width: 23 }}
                      className="bg-green rounded-full shrink-0 mr-3 mt-1"
                    ></div>
                    <div className="flex flex-col items-start w-full">
                      <div className="font-bold">
                        {t.fname} {t.lname}
                      </div>
                      <div className="flex flex-row justify-between w-full text-10">
                        <span>{t.productName}</span>
                        <span>{moment(t.date).format("MMM, Do")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-4 green">
                No Transactions Data for this month
              </div>
            )}
          </div>
          <div className="absolute h-1/6 bottom-0 rounded-b-2xl transaciton-bottom w-full left-0 "></div>
          <div
            onClick={() =>
              (ref?.current as unknown as Element).scrollTo({
                top: 4000,
                behavior: "smooth",
              })
            }
            style={{ height: 35, width: 35, left: "calc(50% - 17px)" }}
            className="cursor-pointer rounded-full bg-green flex flex-col justify-center items-center absolute bottom-4"
          >
            <img src="/vector-down.svg" />
          </div>
        </div>
      </div>
    </div>
  );
};
