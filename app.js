const express = require('express')
var bodyParser = require('body-parser')
const nodemailer = require("nodemailer");
const compression = require("compression");
const helmet = require("helmet");
var cors = require('cors')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);
const port = 3000

var jsonParser = bodyParser.json()

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post("/send", jsonParser, async (req, res) => {

  const mailBody = `<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
    integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous" />
  <link rel="stylesheet" href="https://www.cic.gc.ca/wet-v4/dist/GCWeb/css/theme.min.css" />
  <link href="https://www.cic.gc.ca/css/util-wet4.css" media="screen, print" rel="stylesheet" type="text/css" />
  <link href="https://www.cic.gc.ca/css/bootstrap-equivalence.css" media="screen, print" rel="stylesheet"
    type="text/css" />
  <link href="https://www.cic.gc.ca/css/cic-wet4.css" media="screen, print" rel="stylesheet" type="text/css" />
</head>
<style>
  #calculator-section {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f2f2f2;
    padding: 20px;
    box-sizing: border-box;
  }

  #alert-info-div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: rgb(111, 164, 189);
    padding: 20px;
    border-radius: 8px;
    box-sizing: border-box;
  }

  #crs-intro {
    margin-top: 1em;
  }

  #sub-text-crs-intro {
    margin-top: 1em;
    font-size: 1.1em;
    margin-bottom: 2em;
  }

  #crs-form-div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 2px solid rgb(111, 164, 189);

    padding: 20px;
    border-radius: 8px;
    box-sizing: border-box;
  }


  .crs-select {
    border: 2px solid rgb(111, 164, 189);
    border-radius: 4px;
    height: 2em;
    margin-top: 0.8em;
    margin-left: 0.5em;
  }

  .form-group {
    display: flex;
    flex-direction: column;

  }

  #results-box {
    width: 100%;
    height: 100%;
    border: 2px solid rgb(52, 52, 53);
    border-radius: 8px;
    margin-top: 1em;
    padding: 1.5em;
  }

  #results{

    background-color: red;
  }
</style>

<body>





  <section>
    <div class="alert alert-info">
      <p>
        <strong>Legal Disclaimer:</strong> This tool is intended solely for
        general guidance and reference purposes. In the event of any
        discrepancy between the results of this questionnaire and that
        provided by the Express Entry electronic system, the results provided
        by the system shall govern, in accordance with provisions of the
        <em>Immigration and Refugee Protection Act</em>, the
        <em>Immigration and Refugee Protection Regulations</em>, and
        Minister's Instructions issued under IRPA s.10.3. This tool will be
        updated from time to time in accordance with changes to the
        Ministerial Instructions governing Express Entry.
      </p>
    </div>

    <p>
      This tool will help you calculate your Comprehensive Ranking System
      (CRS) score based on the answers you provide below. The CRS is a
      points-based system that we use to assess and score
      <a
        href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile.html">your
        profile</a>
      and rank it in the Express Entry pool. It&rsquo;s used to assess your:
    </p>

    <ul>
      <li>skills</li>
      <li>education</li>
      <li>language ability</li>
      <li>work experience</li>
      <li>other factors</li>
    </ul>

    <h2>Use this tool if</h2>

    <ul>
      <li>
        you’re
        <a
          href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility.html">eligible
          for at least 1 Express Entry program</a><br />and
      </li>
      <li>
        you <strong>have not filled out an Express Entry profile</strong> but
        you’d like to see what your
        <a
          href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system.html">Comprehensive
          Ranking System (CRS)</a>
        score might be if you do<br />or
      </li>
      <li>
        you <strong>were invited to apply for permanent residence</strong>,
        and want to see if a change to your profile may affect your CRS score
      </li>
    </ul>

    <p>
      To get an invitation to apply, your CRS score must be above the minimum
      points score of your
      <a
        href="https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds.html">round
        of invitations</a>
      (cut-off scores may vary each round).
    </p>

    <div class="wb-frmvld">
      <form id="crsform">
        <div id="dq" class="form-group">
          <label for="dq">1) What is your marital status?</label><br>
          <b>${req.body.marital_status}</b><br>
          <br>
        </div>

        <div style="display:${(req.body.marital_status==="Common-Law" || req.body.marital_status==="Married")?"block":"none"}">
        <div id="dq2i" class="form-group" >
          <label for="dq2i">2) i. Is your spouse or common-law partner a citizen or permanent
            resident of Canada?</label><br>
            <b>${req.body.spouse_or_common_law_partner_resident_of_canada}</b><br>
        </div>


        <div id="dq2ii" class="form-group" >
          <label for="dq2ii">2) ii. Will your spouse or common-law partner come with you to
            Canada?</label><br>
            <b>${req.body.spouse_or_common_law_partner_come_with_you}</b><br>
        </div>
        </div>


        <div id="dq3" class="form-group" >
          <label for="dq3">3) How old are you?</label>

          <p>Choose the best answer:</p>
          <ul>
            <li>
              If you’ve been invited to apply, enter your age on the date you
              were invited.<br />OR
            </li>
            <li>
              If you plan to complete an Express Entry profile, enter your
              current age.
            </li>
          <b>${req.body.age}</b><br><br>
        </div>


        <div id="dq4" class="form-group" >
          <label for="dq4">4) What is your level of education?</label>
          <p>Enter the highest level of education for which you:</p>
          <ul>
            <li>
              earned a
              <strong>Canadian degree, diploma or certificate</strong> or
            </li>
            <li>
              had an Educational Credential Assessment (ECA) if you did your
              study outside Canada. (ECAs must be from an approved agency, in
              the last five years)
            </li>
          </ul>
          <p>
            Note: a Canadian degree, diploma or certificate must either have
            been earned at an accredited Canadian university, college, trade
            or technical school, or other institute in Canada. Distance
            learning counts for education points, but not for bonus points in
            your profile or application.
          <b>${req.body.education}</b><br><br>
        </div>


        <div id="dq4be" class="form-group" >
          <label for="q4b">4b) Have you earned a Canadian degree, diploma or
            certificate?</label>
          <p>Note: to answer yes:</p>

          <ul>
            <li>
              English or French as a Second Language must not have made up
              more than half your study
            </li>
            <li>
              you must not have studied under an award that required you to
              return to your home country after graduation to apply your
              skills and knowledge
            </li>
            <li>
              you must have studied at a school within Canada (foreign
              campuses don&rsquo;t count)
            </li>
            <li>
              you had to be enrolled full time for at least eight months,
              <strong>unless you completed the study or training program (in whole
                or in part) between March 2020 and August 2022</strong>
            </li>
            <li>
              you had to have been physically present in Canada for at least
              eight months,
              <strong>unless you completed the study or training program (in whole
                or in part) between March 2020 and August 2022</strong>
            </li>
          </ul>
        </div>
        <b>${req.body.education_canada}</b><br><br>


        <div id="dq4c" class="form-group" style="display:${(req.body.education_canada==="Yes")?"block":"none"}>
          <label for="q4c">4c) Choose the best answer to describe this level of
            education.</label><br>
            <b>${req.body.education_canada_level}</b><br>
        </div>


        <div id="dq5" class="form-group" >
          <p>
            <strong>5) Official languages: Canada's official languages are English
              and French.</strong>
          </p>
          <p>
            <strong>You need to submit language test results that are less than two
              years old for all programs under Express Entry, even if English
              or French is your first language.</strong>
          </p>

        </div>


        <div id="dq5i" >
          <label for="dq5i">i. Are your test results less than two years old?</label><br>
          <b>${req.body.languageTestOlderThanTwoYears}</b><br><br>
        </div>

        <div style="display:${(req.body.languageTestOlderThanTwoYears==="Yes")?"block":"none"}">
        <div id="dq5ii" >
          <label for="dq5ii">ii. Which language test did you take for your first official
            language?
          </label><br>
          <b>${req.body.firstLanguageTest}</b>
        </div>


        <div id="q5ia" style="display:${(req.body.firstLanguageTest==="CELPIP-G")?"block":"none"}">
          <p>Enter your test scores of CELPIp-G:</p>

          <label for="q5i-a-speaking">Speaking:</label>
          <br>
          <b>${req.body.CELPIP_G_Speaking}</b><br>

          <label for="q5i-a-listening">Listening:</label>
          <br>
          <b>${req.body.CELPIP_G_Listening}</b><br>

          <label for="q5i-a-reading">Reading:</label>
          <br>
          <b>${req.body.CELPIP_G_Reading}</b><br>

          <label for="q5i-a-writing">Writing:</label>
          <br>
          <b>${req.body.CELPIP_G_Writing}</b><br>
        </div>


        <div id="q5ib" style="display:${(req.body.firstLanguageTest==="IELTS")?"block":"none"}">
          <p>Enter your IELTS test scores:</p>

          <label for="q5i-b-speaking">Speaking:</label>
          <br>
          <b>${req.body.IELTS_Speaking}</b><br>

          <label for="q5i-b-listening">Listening:</label>
          <br>
          <b>${req.body.IELTS_Listening}</b><br>

          <label for="q5i-b-reading">Reading:</label>
          <br>
          <b>${req.body.IELTS_Reading}</b><br>

          <label for="q5i-b-writing">Writing:</label>
          <br>
          <b>${req.body.IELTS_Writing}</b><br>
        </div>


        <div id="q5ic" style="display:${(req.body.firstLanguageTest==="TEF Canada")?"block":"none"}">
          <p>Enter your TEF Canada test scores:</p>

          <label for="q5i-c-speaking">Speaking:</label>
          <br>
          <b>${req.body.TEF_Canada_Speaking}</b><br>

          <label for="q5i-c-listening">Listening:</label>
          <br>
          <b>${req.body.TEF_Canada_Listening}</b><br>

          <label for="q5i-c-reading">Reading:</label>
          <br>
          <b>${req.body.TEF_Canada_Reading}</b><br>

          <label for="q5i-c-writing">Writing:</label>
          <br>
          <b>${req.body.TEF_Canada_Writing}</b><br>
        </div>


        <div id="q5id" style="display:${(req.body.firstLanguageTest==="TCF Canada")?"block":"none"}">
          <p>Enter your TCF Canada test scores:</p>

          <label for="q5i-d-speaking">Speaking:</label>
          <br>
          <b>${req.body.TCF_Canada_Speaking}</b><br>

          <label for="q5i-d-listening">Listening:</label>
          <br>
          <b>${req.body.TCF_Canada_Listening}</b><br>

          <label for="q5i-d-reading">Reading:</label>
          <br>
          <b>${req.body.TCF_Canada_Reading}</b><br>

          <label for="q5i-d-writing">Writing:</label>
          <br>
          <b>${req.body.TCF_Canada_Writing}</b><br>
        </div>

        <div id="dq5iiia" >
          <label for="dq5iii">iii. Do you have other language results?</label>
          <p>
            If so, which language test did you take for your second official
            language?
          </p>
          <p>Test results must be less than two years old.</p>

          <b>${(req.body.firstLanguageTest==="IELTS" || req.body.firstLanguageTest==="CELPIG-G")?req.body.additional_language_2:req.body.additional_language}</b><br><br>
        </div>


        <div id="eq5ia" style="display:${(req.body.additional_language==="CELPIP-G")?"block":"none"}">
          <p>Enter your test scores of CELPIp-G:</p>

          <label for="eq5i-a-speaking">Speaking:</label>
          <br>
          <b>${req.body.CELPIP_G_Speaking2}</b><br>

          <label for="eq5i-a-listening">Listening:</label>
          <br>
          <b>${req.body.CELPIP_G_Listening2}</b><br>

          <label for="eq5i-a-reading">Reading:</label>
          <br>
          <b>${req.body.CELPIP_G_Reading2}</b><br>

          <label for="eq5i-a-writing">Writing:</label>
          <br>
          <b>${req.body.CELPIP_G_Writing2}</b><br>
        </div>


        <div id="eq5ib" style="display:${(req.body.additional_language==="IELTS")?"block":"none"}">
          <p>Enter your IELTS test scores:</p>

          <label for="eq5i-b-speaking">Speaking:</label>
          <br>
          <b>${req.body.IELTS_Speaking2}</b><br>

          <label for="eq5i-b-listening">Listening:</label>
          <br>
          <b>${req.body.IELTS_Listening2}</b><br>

          <label for="eq5i-b-reading">Reading:</label>
          <br>
          <b>${req.body.IELTS_Reading2}</b><br>

          <label for="eq5i-b-writing">Writing:</label>
          <br>
          <b>${req.body.IELTS_Writing2}</b><br>
        </div>


        <div id="eq5ic" style="display:${(req.body.additional_language_2==="TEF Canada")?"block":"none"}">
          <p>Enter your TEF Canada test scores:</p>

          <label for="eq5i-c-speaking">Speaking:</label>
          <br>
          <b>${req.body.TEF_Canada_Speaking2}</b><br>

          <label for="eq5i-c-listening">Listening:</label>
          <br>
          <b>${req.body.TEF_Canada_Listening2}</b><br>

          <label for="eq5i-c-reading">Reading:</label>
          <br>
          <b>${req.body.TEF_Canada_Reading2}</b><br>

          <label for="eq5i-c-writing">Writing:</label>
          <br>
          <b>${req.body.TEF_Canada_Writing2}</b><br>
        </div>


        <div id="eq5id" style="display:${(req.body.additional_language_2==="TCF Canada")?"block":"none"}">
          <p>Enter your TCF Canada test scores:</p>

          <label for="eq5i-d-speaking">Speaking:</label>
          <br>
          <b>${req.body.TCF_Canada_Speaking2}</b><br>

          <label for="eq5i-d-listening">Listening:</label>
          <br>
          <b>${req.body.TCF_Canada_Listening2}</b><br>

          <label for="eq5i-d-reading">Reading:</label>
          <br>
          <b>${req.body.TCF_Canada_Reading2}</b><br>

          <label for="eq5i-d-writing">Writing:</label>
          <br>
          <b>${req.body.TCF_Canada_Writing2}</b><br>
        </div>






        <div id="dq6" class="form-group" >
          <p><strong>6) Work Experience</strong></p>

          <div id="q6i-canada">
            <label for="q6i">i. In the last ten years, how many years of skilled work
              experience in Canada do you have?
            </label>
            <p>
              It must have been paid and full-time (or an equal amount in
              part-time).
            </p>
            <p>
              <strong>Note:</strong> In Canada, the National Occupational
              Classification (NOC) is the official list of all the jobs in the
              Canadian labour market. It describes each job according to the
              training, education, experience and responsibilities (TEER)
              needed to work in the job.
            </p>

            <p>
              &quot;Skilled work&quot; in the NOC is TEER 0, 1, 2 or 3
              category jobs:
            </p>

            <p>
              If you aren’t sure of the NOC TEER category for this job, you
              can
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/find-national-occupation-code.html">find
                your NOC</a>.
            </p>
            <b>${req.body.work_experience}</b><br><br>
          </div>

          <div id="dq6ii" >
            <label for="dq6ii">ii. In the last 10 years, how many total years of foreign
              skilled work experience do you have?
            </label>
            <p>
              It must have been paid, full-time (or an equal amount in
              part-time), and in only one occupation (NOC TEER category 0, 1,
              2 or 3).
            </p>
            <b>${req.body.skilled_work_experience}</b><br><br>
            
          </div>
        </div>


        <div id="dq7" >
          <label for="dq7">7) Do you have a certificate of qualification from a Canadian
            province, territory or federal body?</label>

          <p>
            <strong>Note: </strong>A certificate of qualification lets people
            work in some skilled trades in Canada. Only the provinces,
            territories and a federal body can issue these certificates. To
            get one, a person must have them assess their training, trade
            experience and skills to and then pass a certification exam.
          </p>

          <p>
            People usually have to go to the province or territory to be
            assessed. They may also need experience and training from an
            employer in Canada.
          </p>

          <p>
            This isn’t the same as a nomination from a province or territory.
          </p>
          <br>
          <b>${req.body.certificate_of_qualification}</b><br>
        </div>


        <div id="dq8" >
          <p><strong>Additional Points</strong></p>

          <label for="q8">8) Do you have a valid job offer supported by a Labour Market
            Impact Assessment (<a
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/offer-employment/lmia-exempt.html">if
              needed</a>)?</label>

          <p>A valid job offer must be</p>

          <ul>
            <li>full-time</li>
            <li>
              in a skilled job listed as TEER 0, 1, 2 or 3 in the 2021
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/find-national-occupation-code.html">National
                Occupational Classification</a>
            </li>
            <li>
              supported by a Labour Market Impact Assessment (LMIA) or exempt
              from needing one
            </li>
            <li>
              for one year from the time you become a permanent resident
            </li>
          </ul>

          <p>A job offer isn’t valid if your employer is:</p>

          <ul>
            <li>an embassy, high commission or consulate in Canada or</li>
            <li>on the list of ineligible employers.</li>
          </ul>

          <p>
            Whether an offer is valid or not also depends on different
            factors, depending on your case. See a
            <a
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/offer-employment.html">full
              list of criteria for valid job offers</a>.
          </p>
          <b>${req.body.valid_job_offer}</b><br><br>
        </div>


        <div id="q8n" >
          <label for="q8n">8a) Which NOC TEER is the job offer?</label>
          <p>
            <a
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/find-national-occupation-code.html">Find
              out your job’s TEER</a>
            if you don’t know.
          </p>
          <br>
          <b>${req.body.nooc_tier}</b><br>
        </div>


        <div id="dq9" >
          <label for="dq9">9) Do you have a nomination certificate from a province or
            territory?</label>
          <br>
          <b>${req.body.nomination_certificate}</b><br>
        </div>


        <div id="dq10" >
          <label for="dq10">10) Do you or your spouse or common law partner (if they will
            come with you to Canada) have at least one brother or sister
            living in Canada who is a citizen or permanent resident?</label>
          <p>
            <strong>Note: to answer yes, the brother or sister must be:</strong>
          </p>
          <ul>
            <li>18 years old or older</li>
            <li>
              related to you or your partner by blood, marriage, common-law
              partnership or adoption
            </li>
            <li>have a parent in common with you or your partner</li>
          </ul>
          <p>A brother or sister is related to you by:</p>
          <ul>
            <li>blood (biological)</li>
            <li>adoption</li>
            <li>marriage (step-brother or step-sister)</li>
          </ul>
          <b>${req.body.spouse_coming_along}</b><br><br>
        </div>


        <div id="dq10i" >
          <div id="dq10i">
            <label for="q10">11) What is the highest level of education for which your
              spouse or common-law partner's has:</label>
            <ul>
              <li>
                <strong>earned a Canadian degree, diploma or certificate;
                  or</strong>
              </li>
              <li>
                <strong>had an Educational Credential Assessment (ECA)? (ECAs must
                  be from an approved agency, in the last five years)</strong>
              </li>
            </ul>

            <p>
              To get the correct number of points, make sure you choose the
              answer that best reflects your case. For example:
            </p>
            <p>
              If you have TWO Bachelor&rsquo;s degrees, or one
              Bachelor&rsquo;s AND a two year college diploma, choose –
              &ldquo;Two or more certificates, diplomas, or degrees. One must
              be for a program of three or more years.&rdquo;
            </p>

            <b>${req.body.spouse_education}</b><br><br>
          </div>

          <div id="dq11" >
            <label for="dq11">12) In the last ten years, how many years of skilled work
              experience in Canada does your spouse/common-law partner have?
            </label>
            <p>
              It must have been paid, full-time (or an equal amount in
              part-time), and in one or more NOC TEER category 0, 1, 2, or 3
              jobs.
            </p>
            <b>${req.body.spouse_work_experience}</b><br><br>
          </div>


          <div id="dq12" >
            <label for="dq12i">13) i) Did your spouse or common-law partner take a language
              test? If so, which one?</label>
            <p>Test results must be less than two years old.</p>
            <br>
            <b>${req.body.spouse_language_test}</b><br>
            <br>
          </div>

          <div id="qq5ia" style="display:${(req.body.spouse_language_test==="CELPIP-G")?"block":"none"}">
            <p>Enter your test scores of CELPIp-G:</p>

            <label for="sq5i-a-speaking">Speaking:</label>
            <br>
            <b>${req.body.spouse_CELPIP_G_Speaking}</b><br>
            <label for="sq5i-a-listening">Listening:</label>
            <br>
            <b>${req.body.spouse_CELPIP_G_Listening}</b><br>

            <label for="sq5i-a-reading">Reading:</label>
            <br>
            <b>${req.body.spouse_CELPIP_G_Reading}</b><br>

            <label for="sq5i-a-writing">Writing:</label>
            <br>
            <b>${req.body.spouse_CELPIP_G_Writing}</b><br>
          </div>


          <div id="qq5ib" style="display:${(req.body.spouse_language_test==="IELTS")?"block":"none"}">
            <p>Enter your IELTS test scores:</p>

            <label for="sq5i-b-speaking">Speaking:</label>
            <br>
            <b>${req.body.spouse_IELTS_Speaking}</b><br>

            <label for="q5i-b-listening">Listening:</label>
            <br>
            <b>${req.body.spouse_IELTS_Listening}</b><br>

            <label for="sq5i-b-reading">Reading:</label>
            <br>
            <b>${req.body.spouse_IELTS_Reading}</b><br>

            <label for="sq5i-b-writing">Writing:</label>
            <br>
            <b>${req.body.spouse_IELTS_Writing}</b><br>
          </div>


          <div id="qq5ic" style="display:${(req.body.spouse_language_test==="TEF Canada")?"block":"none"}">
            <p>Enter your TEF Canada test scores:</p>

            <label for="sq5i-c-speaking">Speaking:</label>
            <br>
            <b>${req.body.spouse_TEF_Canada_Speaking}</b><br>

            <label for="sq5i-c-listening">Listening:</label>
            <br>
            <b>${req.body.spouse_TEF_Canada_Listening}</b><br>

            <label for="sq5i-c-reading">Reading:</label>
            <br>
            <b>${req.body.spouse_TEF_Canada_Reading}</b><br>

            <label for="sq5i-c-writing">Writing:</label>
            <br>
            <b>${req.body.spouse_TEF_Canada_Writing}</b><br>
          </div>


          <div id="qq5id" style="display:${(req.body.spouse_language_test==="TCF Canada")?"block":"none"}">
            <p>Enter your TCF Canada test scores:</p>

            <label for="sq5i-d-speaking">Speaking:</label>
            <br>
            <b>${req.body.spouse_TCF_Canada_Speaking}</b><br>


            <label for="sq5i-d-listening">Listening:</label>
            <br>
            <b>${req.body.spouse_TCF_Canada_Listening}</b><br>

            <label for="sq5i-d-reading">Reading:</label>
            <br>
            <b>${req.body.spouse_TCF_Canada_Reading}</b><br>

            <label for="sq5i-d-writing">Writing:</label>
            <br>
            <b>${req.body.spouse_TCF_Canada_Writing}</b><br>
          </div>




        </div>

    </div>

    </div>





    <div id="neg-results"></div>

    <div id="results">
      <div class="alert alert-info">
        <h2>Your results</h2>
        <p>
          All Express Entry candidates get a score out of 1,200, based on the
          four parts of the Comprehensive Ranking System formula.
        </p>
        <p>
          We invite the highest-ranking candidates from the pool to apply as a
          permanent resident through regular “rounds of invitations.” See what
          minimum scores have been in the past.
        </p>
        <div id="core_factors"></div>
        <div id="spouse_factors"></div>
        <div id="skill_factors"></div>
        <div id="bonus_factors"></div>
        <div id="totals"></div>
      </div>
    </div>

    <div id="test"></div>
  </section>

  <p>Your CRS Score is : ${req.body.crs}<span id="Resultout"></span></p>
  </form>
</body>

</html>`

  console.log(req.body)
   const info = await transporter.sendMail({
     from: '"Amal Thomas" <thomasamal479@gmail.com>', // sender address
     to: req.body.email, // list of receivers
     subject: "CRS Calculator form response",  // plain text body
     html: mailBody, // html body
   });

   console.log("Message sent: %s", info.messageId);
   return res.json({ status:200,message: "Email sent" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})