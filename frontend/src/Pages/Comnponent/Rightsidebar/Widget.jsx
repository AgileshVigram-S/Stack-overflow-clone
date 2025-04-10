import React from "react";
import "./Rightsidebar.css";
import comment from "../../assets/comment-alt-solid.svg";
import pen from "../../assets/pen-solid.svg";
import blackLogo from "../../assets/blacklogo.svg";
import { useTranslation } from "react-i18next";

const Widget = () => {
  const { t } = useTranslation(); // Hook to access translations

  return (
    <div className="widget">
      <h4>{t("overflow_blog")}</h4>
      <div className="right-sidebar-div-1">
        <div className="right-sidebar-div-2">
          <img src={pen} alt="pen" width="18" />
          <p>{t("observability_article")}</p>
        </div>
        <div className="right-sidebar-div-2">
          <img src={pen} alt="pen" width="18" />
          <p>{t("podcast_374")}</p>
        </div>
      </div>

      <h4>{t("featured_on_meta")}</h4>
      <div className="right-sidebar-div-1">
        <div className="right-sidebar-div-2">
          <img src={comment} alt="comment" width="18" />
          <p>{t("review_queue_release")}</p>
        </div>
        <div className="right-sidebar-div-2">
          <img src={comment} alt="comment" width="18" />
          <p>{t("welcome_associates")}</p>
        </div>
        <div className="right-sidebar-div-2">
          <img src={blackLogo} alt="logo" width="18" />
          <p>{t("outdated_answers")}</p>
        </div>
      </div>

      <h4>{t("hot_meta_posts")}</h4>
      <div className="right-sidebar-div-1">
        <div className="right-sidebar-div-2">
          <p>38</p>
          <p>{t("spam_flag_declined")}</p>
        </div>
        <div className="right-sidebar-div-2">
          <p>20</p>
          <p>{t("user_high_rep_action")}</p>
        </div>
        <div className="right-sidebar-div-2">
          <p>14</p>
          <p>{t("how_to_ask_comment")}</p>
        </div>
      </div>
    </div>
  );
};

export default Widget;
