import React from "react";
import { Typography, Image } from "antd";

const { Title, Text } = Typography;

// displays a page header

export default function Header({ link, title, subTitle, imgSrc, ...props }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.2rem" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "start" }}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {/* Group the title and the image in a div element. They are displayed side by side because of the flexDirection: "row". */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Image src={imgSrc} width={50} style={{ marginRight: "0.5rem" }} />
            <Title level={4} style={{ margin: "0 0.5rem 0 0" }}>
              {title}
            </Title>
          </div>
        </a>
        {/* The subtitle text is separated from the above div (which contains the title and the image) by being in a different element.
            Therefore, it is displayed below the title and image. */}
        <Text type="secondary" style={{ textAlign: "left" }}>
          {subTitle}
        </Text>
      </div>
      {props.children}
    </div>
  );
}

Header.defaultProps = {
  link: "https://www.schloss-proschwitz.de",
  title: " Weingut Schloss Proschwitz 🍷",
  subTitle: "Blockchain-basierter Produktpass für Wein von Schloss Proschwitz ",
  imgSrc: "https://www.schloss-proschwitz.de/wp-content/uploads/2021/09/Dachmarke_Schloss_Proschwitz_2zeilig_CMYK.jpg",
};
