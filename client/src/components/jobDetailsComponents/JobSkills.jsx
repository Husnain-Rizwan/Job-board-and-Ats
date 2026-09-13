const JobSkills = ({ skills = [] }) => (
  <section className="details-content-block">
    <p className="eyebrow">What you will bring</p>
    <h2>Skills &amp; requirements</h2>
    <div className="details-skills">
      {skills.length ? (
        skills.map((skill, index) => (
          <span key={`${skill}-${index}`}>{skill}</span>
        ))
      ) : (
        <p>No skills listed.</p>
      )}
    </div>
  </section>
);

export default JobSkills;
