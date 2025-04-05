import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Tag.css";

const TagsPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const tags = [
    { name: "javascript", description: t('tags.javascript_description'), questions: "2538034", askedToday: "102", thisWeek: "605" },
    { name: "python", description: t('tags.python_description'), questions: "2220938", askedToday: "177", thisWeek: "1106" },
    { name: "java", description: t('tags.java_description'), questions: "1923579", askedToday: "75", thisWeek: "440" },
    { name: "php", description: t('tags.php_description'), questions: "1469894", askedToday: "88", thisWeek: "220" },
    { name: "android", description: t('tags.android_description'), questions: "1422275", askedToday: "47", thisWeek: "332" },
    { name: "html", description: t('tags.html_description'), questions: "1191492", askedToday: "34", thisWeek: "259" },
    { name: "jquery", description: t('tags.jquery_description'), questions: "1033772", askedToday: "5", thisWeek: "41" },
    { name: "css", description: t('tags.css_description'), questions: "809112", askedToday: "28", thisWeek: "218" },
    { name: "mysql", description: t('tags.mysql_description'), questions: "662713", askedToday: "28", thisWeek: "120" },
    { name: "reactjs", description: t('tags.reactjs_description'), questions: "482623", askedToday: "71", thisWeek: "390" },
    { name: "node.js", description: t('tags.nodejs_description'), questions: "475289", askedToday: "40", thisWeek: "239" },
    { name: "c#", description: t('tags.csharp_description'), questions: "1626785", askedToday: "73", thisWeek: "405" },
  ];

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tags-page">
      <div className="header">
        <h1>{t("tags.title")}</h1>
        <p>{t("tags.intro")}</p>
        <input
          type="text"
          placeholder={t("tags.search_placeholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="tags-grid">
        {filteredTags.map((tag, index) => (
          <div className="tag-card" key={index}>
            <div className="tag-title">
              <h3>{tag.name}</h3>
              <p>{tag.description}</p>
            </div>
            <div className="tag-stats">
              <p>{t("tags.questions_count", { count: tag.questions })}</p>
              <p>{t("tags.activity", { today: tag.askedToday, week: tag.thisWeek })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsPage;
