import { useState, useEffect } from 'react';
import './App.scss';
import results from './data.json';

function App() {

  const inputFields = [
    { name: "Experience", id: "experience", value: '5' },
    { name: "Skills", id: "skills", value: 'Sales' },
    { name: "Highly Relevant keywords", id: "highlyRelevantkeywords", value: 'Sales' },
    { name: "Nice to have Relevant Keywords", id: "relevantKeywords", value: 'Sales' },
    { name: "Relevant organizations", id: "relevantOrganizations", value: 'TCS' },
  ]
  const [fields, setFields] = useState(inputFields);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [maxScore, setMaxScore] = useState(null);
  const [current, setCurrent] = useState(null);
  const [sortBy, setSortBy] = useState("desc");

  useEffect(() => {
    const maxScore = {
      final_exp_score: Math.max.apply(Math, results.map(item => item.experience.final_exp_score)),
      final_skills_score: Math.max.apply(Math, results.map(item => item.skills.final_skills_score)),
      exp_duration_score: Math.max.apply(Math, results.map(item => item.exp_duration.exp_duration_score)),
      education_score: Math.max.apply(Math, results.map(item => item.education.education_score))
    }

    setMaxScore(maxScore);
    sort();
  }, [sortBy]);

  function sort() {
    sortBy === 'asc' ?
      results.sort((a, b) => (a.total_score > b.total_score) ? 1 : ((b.total_score > a.total_score) ? -1 : 0))
      :
      results.sort((a, b) => (b.total_score > a.total_score) ? 1 : ((a.total_score > b.total_score) ? -1 : 0));
  }

  function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setTimeout(dummyFunction, 1000);

  }

  function dummyFunction() {
    setSubmitted(true);
    setLoading(false);
  }

  function handleChange(i, event) {
    const values = [...fields];
    values[i].value = event.target.value;
    setFields(values);
  }

  function createMarkup(text) {
    return { __html: text };
  }

  return (
    <div className="app container-fluid">
      <div className="row">
        <div className="left-panel col-4">
          <form className="m-3" onSubmit={onSubmit}>
            <div className="my-4">
              <h4>Fill all the fields</h4>
              <p>All the fields are required</p>
            </div>
            {fields.map((field, key) =>
              <div className="mb-3" key={key}>
                <label htmlFor={field.id} className="visually-hidden">{field.name}</label>
                <input type="text"
                  className="form-control"
                  id={field.id}
                  name={field.id}
                  required

                  value={field.value || ''}
                  onChange={e => handleChange(key, e)} />
              </div>
            )}
            <div className="mb-3 float-right">
              <button type="submit" className="btn btn-primary my-3 px-5">Process</button>
            </div>
          </form>
        </div>
        <div className="right-panel col-8">
          {submitted ?
            <>
              <br />
              <div className="card border-0 mb-1">
                <div className="card-body">
                  <span>Sort By</span><br />
                  <select className="form-select" onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                    <option value="asc">Ascending Score</option>
                    <option value="desc">Descending Score</option>
                  </select>
                </div>
              </div>
              {results.map((result, key) =>
                <div className="accordion" id={`accordion${key}`} key={key}>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={`heading${key}`}>
                      <button className="accordion-button" type="button" onClick={() => setCurrent(key)} data-bs-toggle="collapse" data-bs-target={`#collapse${key}`}
                        aria-expanded="true" aria-controls={`collapse${key}`}>
                        <div className="row">
                          <div className="col-2">
                            <h5 className="text-primary">{result.cv_name}</h5>
                          </div>

                          <div className="col-8">
                            <div className="row justify-content-md-center">
                              <div className="col-2">
                                <h6 className="text-description">Experience</h6>
                                <div className="progress" style={{ height: '2px' }}>
                                  <div className="progress-bar" role="progressbar"
                                    style={{ width: `${result.experience.final_exp_score / maxScore.final_exp_score * 100}%` }} ></div>
                                </div>
                              </div>
                              <div className="col-2">
                                <h6 className="text-description">skills</h6>
                                <div className="progress" style={{ height: '2px' }}>
                                  <div className="progress-bar" role="progressbar"
                                    style={{ width: `${result.skills.final_skills_score / maxScore.final_skills_score * 100}%` }} ></div>
                                </div>
                              </div>
                              <div className="col-3">
                                <h6 className="text-description">Experience Duration</h6>
                                <div className="progress" style={{ height: '2px' }}>
                                  <div className="progress-bar bg-success" role="progressbar"
                                    style={{ width: `${result.exp_duration.exp_duration_score / maxScore.exp_duration_score * 100}%` }} ></div>
                                </div>
                              </div>
                              <div className="col-2">
                                <h6 className="text-description">Education</h6>
                                <div className="progress" style={{ height: '2px' }}>
                                  <div className="progress-bar bg-info" role="progressbar"
                                    style={{ width: `${result.education.education_score / maxScore.education_score * 100}%` }} ></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-2">
                            <h6 className="text-primary">{Math.round(result.total_score * 100) / 100}</h6>
                            <h6 className="text-description">Score</h6>
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div id={`collapse${key}`} className={key === current ? 'accordion-collapse collapse show' : 'accordion-collapse collapse'}
                      aria-labelledby={`heading${key}`} data-bs-parent={`#accordion${key}`}>
                      {/* EXPERIENCE */}
                      <div>
                        <h5>EXPERIENCE  <span className="text-primary h2">{Math.round(result.experience.final_exp_score * 100) / 100}</span></h5>
                        <small dangerouslySetInnerHTML={createMarkup(result.experience.text)} />
                      </div>

                      {/* EXPERIENCE DURATION */}
                      <div><br />
                        <h5>EXPERIENCE DURATION <span className="text-primary h2">{Math.round(result.exp_duration.exp_duration_score * 100) / 100}</span></h5>
                        {result.exp_duration.workspan.map((duration, key) => <li key={key}>{duration}</li>)}
                      </div>

                      {/* SKILLS */}
                      <div><br />
                        <h5>SKILLS <span className="text-primary h2">{Math.round(result.skills.final_skills_score * 100) / 100}</span></h5>
                        <small dangerouslySetInnerHTML={createMarkup(result.skills.text)} />

                        <div className="row">
                          <div className="col">
                            <div className="card text-white bg-primary">
                              <div className="card-body">
                                <h6><span className="display-4">{Math.round(result.skills.syntactic_match.final_syntactic_match_score * 100) / 100} </span><span>Syntactic score</span></h6>
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="card text-white bg-success">
                              <div className="card-body">
                                <h6><span className="display-4">{Math.round(result.skills.semantic_match.final_semantic_match_score * 100) / 100} </span><span>semantic score</span></h6>
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="card text-white bg-warning">
                              <div className="card-body">
                                <h6><span className="display-4">{Math.round(result.skills.final_skills_score * 100) / 100} </span><span>Final score</span></h6>
                              </div>
                            </div>
                          </div>
                        </div>

                        {result.skills.syntactic_match.analysis.length > 0 &&
                          <div><br />
                            <b>Syntactic Match Analysis</b>
                            <ol className="list-group list-group-numbered">
                              {result.skills.syntactic_match.analysis.map((item, key) =>
                                <li key={key} className="list-group-item d-flex justify-content-between align-items-start">
                                  <div className="ms-2 me-auto">
                                    <div className="font-weight-bold">{item.source_text}</div>
                                    {item.target_text}
                                  </div>
                                  <span className="badge bg-primary rounded-pill text-white">{item.score}</span>
                                </li>
                              )}
                            </ol>

                          </div>
                        }
                      </div>

                      {/* EDUCATION */}
                      <div><br />
                        <h4>EDUCATION  <span className="text-primary h2">{Math.round(result.education.education_score * 100) / 100}</span></h4>
                        <p>Qualification <span><b>{result.education.qualification}</b></span></p>
                        <small dangerouslySetInnerHTML={createMarkup(result.education.text)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </>
            :
            <>
              <div className="center-block">
                {loading && !submitted && <img alt="loading" src="/scan.gif" />}
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
