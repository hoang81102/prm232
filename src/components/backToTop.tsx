import React, { useEffect, useState } from "react";
import ScrollToTop from "react-scroll-to-top";
import "animate.css";

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [animation, setAnimation] = useState("animate__fadeIn");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !visible) {
        setVisible(true);
        setAnimation("animate__fadeIn");
      } else if (window.scrollY <= 300 && visible) {
        // fadeOut kéo dài 1.2s
        setAnimation("animate__fadeOut");
        setTimeout(() => setVisible(false), 1200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  return (
    <main>
      {visible && (
        <div
          className={`fixed bottom-8 right-8 z-50 animate__animated ${animation}`}
          style={{
            animationDuration: "1.2s", // 👈 làm chậm hiệu ứng fadeOut
          }}
        >
          <ScrollToTop
            smooth
            top={300}
            component={<span className="text-white text-lg font-bold">↑</span>}
            style={{
              backgroundColor: "#F2D479",
              borderRadius: "50%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              right: "25px",
              bottom: "30px",
              width: "45px",
              height: "45px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            className="hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
    </main>
  );
};

export default BackToTop;
