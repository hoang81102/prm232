import React from "react";
import ScrollToTop from "react-scroll-to-top";

const BackToTop: React.FC = () => {
  return (
    <main>
      <ScrollToTop
        smooth
        top={300}
        component={<span className="text-white text-lg font-bold">↑</span>}
        style={{
          backgroundColor: "#F2D479", 
          borderRadius: "50%",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          right: "25px", // đẩy nút qua phải một chút
          bottom: "30px", // khoảng cách từ đáy
        }}
      />
    </main>
  );
};

export default BackToTop;
