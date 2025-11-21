import React, { useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type PieLabelRenderProps,
} from "recharts";
import type { PlateData, PlateDataTestType } from "../types/types";

import { motion, type Variants } from "framer-motion";
import { useIsMobile } from "../hooks/useIsMobile";
import TiltedCard from "./TiltedCard";
import { BASE_URL } from "../service/appSerivce";

interface PlateChartProps {
  data: PlateData;
  onReset: () => void;
}

const COLORS: { [key: string]: string } = {
  "Зерновые и картофель": "#22c55e", // green-500
  "Овощи и фрукты": "#ef4444", // red-500
  "Злаки и крупы": "#f97316", // orange-500
  "Белковые продукты": "#3b82f6", // blue-500
};
const RADIAN = Math.PI / 180;

// рендер лейбла
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined ||
    percent === undefined
  ) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="font-bold text-xs sm:text-sm pointer-events-none"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/80 p-4 rounded-lg shadow-lg border border-gray-200 backdrop-blur-sm text-left z-10">
        <p className="font-bold text-gray-800">{data.name}</p>
        <ul className="list-disc list-inside text-gray-600 mt-1">
          {data.items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

const PlateChart: React.FC<PlateChartProps> = ({ data, onReset }) => {
  const chartData = data.plate;

  const isMobile = useIsMobile(768);
  const [chartReady, setChartReady] = useState<boolean>(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="w-full text-center flex flex-col items-center min-h-0"
      variants={containerVariants}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => setChartReady(true)}
    >
      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold text-gray-200 mb-1 max-w-2xl"
      >
        {data.summary}
      </motion.h2>
      <motion.p variants={itemVariants} className="text-lg text-gray-400 mb-8">
        Всего калорий:{" "}
        <span className="font-semibold text-gray-300">
          {data.totalCalories} kcal
        </span>
      </motion.p>

      <div className="w-full min-h-0 max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Изображение */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-md lg:w-1/2"
        >
          {isMobile ? (
            <img
              src={BASE_URL + data.image_url}
              alt="Сгенерированная тарелка здорового питания"
              className="rounded-2xl shadow-lg w-full h-auto object-cover aspect-square border-4 border-white/10"
            />
          ) : (
            <TiltedCard
              altText="Food"
              rotateAmplitude={12}
              scaleOnHover={1.1}
              showMobileWarning={true}
              imageSrc={BASE_URL + data.image_url}
              displayOverlayContent={true}
              showTooltip={false}
            />
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="w-full max-w-md lg:w-1/2 flex flex-col items-center min-h-full"
        >
          <div className="w-full h-80 sm:h-96 relative min-h-0">
            {chartReady && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius="90%"
                    innerRadius="50%"
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[entry.name] || "#888"} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none -z-10">
              <span className="text-gray-400 text-sm">Ваша тарелка</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-300">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[item.name] }}
                ></span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-5xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left"
        >
          <h3 className="font-bold text-lg text-gray-200 mb-3">
            Выводы и рекомендации
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {data.recommendation}
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left"
        >
          <h3 className="font-bold text-lg text-gray-200 mb-3">Ингредиенты</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {data.ingredients.map((item, index) => (
              <li
                key={index}
                className="text-gray-400 text-sm flex items-start"
              >
                <span className="text-lime-400 mr-2 mt-1">&#8226;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.button
        variants={itemVariants}
        onClick={onReset}
        className="mt-12 bg-lime-500/20 text-lime-300 font-bold py-3 px-8 rounded-full hover:bg-lime-500/40 transition-colors duration-300"
      >
        Сгенерировать новую
      </motion.button>
    </motion.div>
  );
};

export default PlateChart;
