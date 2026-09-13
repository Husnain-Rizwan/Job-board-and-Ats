const JobDescription = ({ description }) => (
  <section className="details-content-block">
    <p className="eyebrow">The opportunity</p>
    <h2>Job description</h2>
    <div className="description-copy">
      {description || "No description has been provided for this position."}
    </div>
  </section>
);

export default JobDescription;
