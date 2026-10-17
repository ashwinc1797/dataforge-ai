import re

file_path = "frontend/src/pages/Templates.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

enrichments = {
    "tpl-001": (
        "How can we minimize delivery SLA breaches and optimize rider allocation during peak demand hours?",
        "A deployed intelligent routing system that dynamically assigns riders to multi-stop delivery routes in real-time, reducing late deliveries by 40% and improving overall fleet efficiency."
    ),
    "tpl-002": (
        "What are the key bottlenecks causing prolonged patient wait times, and how can doctor shifts be scheduled to maximize throughput?",
        "An automated hospital resource scheduling dashboard that predicts patient influx and optimizes doctor shifts, successfully decreasing average patient wait times by 25%."
    ),
    "tpl-003": (
        "How can we identify and block unauthorized transactions in real-time without increasing false positives that frustrate legitimate customers?",
        "A highly accurate anomaly detection API that intercepts fraudulent banking transactions with sub-50ms latency, preventing millions in chargebacks while keeping false positives below 0.1%."
    ),
    "tpl-004": (
        "Which high-performing employees are at the highest risk of attrition, and what compensation or cultural factors are driving their dissatisfaction?",
        "An HR retention platform that flags at-risk top talent and recommends targeted intervention strategies (e.g., salary adjustments or role changes) to reduce voluntary turnover by 15%."
    ),
    "tpl-005": (
        "How can we expedite legitimate claim payouts while automatically flagging statistically improbable claims for manual fraud investigation?",
        "A machine learning pipeline that auto-approves low-risk insurance claims instantly while intelligently routing high-risk anomalies to specialized investigators, cutting processing time in half."
    ),
    "tpl-006": (
        "What early warning signs in attendance and assignment grades indicate a student is at risk of failing the final exam?",
        "An early-intervention tracking system for educators that accurately identifies struggling students by week four, allowing targeted tutoring that improves overall class pass rates."
    ),
    "tpl-007": (
        "How can we predict imminent machine failures to schedule preventative maintenance before catastrophic assembly line downtime occurs?",
        "A predictive maintenance alerting system that analyzes live IoT sensor data to forecast equipment degradation, successfully preventing unexpected factory downtime and saving millions in lost production."
    ),
    "tpl-008": (
        "Where are the structural delays in our global shipping network, and how can we reroute cargo to minimize fuel costs and transit times?",
        "An advanced supply chain optimization engine that dynamically reroutes global shipments based on weather and port congestion, resulting in a 10% reduction in total logistics overhead."
    ),
    "tpl-009": (
        "Which property features (e.g., square footage, neighborhood amenities) most heavily influence housing valuations in a volatile market?",
        "A consumer-facing real estate pricing estimator tool that provides accurate, localized property valuations to buyers and sellers, outperforming traditional comparative market analysis."
    ),
    "tpl-010": (
        "How can we predict the probability of a guest canceling their reservation to dynamically adjust overbooking limits and maximize occupancy?",
        "A revenue management algorithm that dynamically adjusts hotel overbooking limits based on cancellation probabilities, maximizing room occupancy rates without risking guest walk-outs."
    ),
    "tpl-011": (
        "Which subscribers are demonstrating behavioral patterns indicative of imminent churn, and what retention offers are most likely to save them?",
        "A targeted customer retention engine that identifies users likely to cancel their subscriptions and automatically deploys personalized discount offers, recovering 20% of potential churners."
    ),
    "tpl-012": (
        "How should we allocate our multi-million dollar marketing budget across social, search, and email channels to maximize customer acquisition ROI?",
        "A multi-touch attribution dashboard that reallocates marketing spend across digital channels in real-time, driving a 30% increase in customer acquisition while maintaining the same budget."
    ),
    "tpl-013": (
        "Are there arbitrage opportunities or predictive momentum indicators hidden within high-frequency ticker data during market open hours?",
        "A fully automated algorithmic trading bot that executes high-frequency trades based on predictive momentum indicators, consistently outperforming baseline market indexes."
    ),
    "tpl-014": (
        "What items are most frequently purchased together, and how should store layouts be redesigned to maximize cross-selling opportunities?",
        "An optimized physical store layout and digital recommendation system driven by market basket analysis, resulting in a measurable increase in average customer basket size."
    ),
    "tpl-015": (
        "How can we automatically categorize negative customer reviews to alert the product team about critical defects without manual reading?",
        "An automated NLP triaging pipeline that instantly categorizes incoming e-commerce reviews by sentiment and specific product defect, alerting engineering teams to critical bugs in real-time."
    ),
    "tpl-016": (
        "Can we detect the onset of sepsis or cardiac arrest hours before critical failure by analyzing real-time fluctuations in patient vital signs?",
        "A clinical decision support system that analyzes continuous vitals to trigger early warning scores, alerting nurses to deteriorating patient conditions hours before clinical onset."
    ),
    "tpl-017": (
        "How can credit card companies detect highly sophisticated fraud rings operating across multiple international accounts?",
        "A graph-based fraud detection architecture that maps relationships between accounts and devices to dismantle coordinated international fraud rings before large-scale extraction occurs."
    ),
    "tpl-018": (
        "What combination of workload, salary stagnation, and management changes most accurately predicts voluntary employee resignation?",
        "An actionable HR analytics dashboard that maps organizational flight risks, empowering managers to proactively address salary stagnation and workload burnout before talent departs."
    ),
    "tpl-019": (
        "How can we accurately calculate the risk premium for new auto insurance applicants based on their vehicle type and past driving behavior?",
        "An actuarial risk modeling engine that dynamically prices auto insurance premiums based on deep behavioral and vehicle risk analysis, improving the company's overall loss ratio."
    ),
    "tpl-020": (
        "At what specific point in the online curriculum do students lose engagement, and how can we intervene to prevent course dropouts?",
        "An adaptive e-learning platform that detects drops in student engagement and dynamically adjusts curriculum pacing or suggests supplementary materials to prevent course dropouts."
    ),
    "tpl-021": (
        "How can we optimize library inventory purchasing to match community borrowing trends and reduce wait times for popular titles?",
        "A data-driven library procurement system that predicts future community borrowing trends, optimizing budget allocation to ensure popular titles are always available."
    ),
    "tpl-022": (
        "Which movies should we recommend to a user on their homepage to maximize streaming watch time and subscription retention?",
        "A personalized content recommendation engine integrated into the streaming homepage that successfully increases average daily user watch time by suggesting highly relevant, hyper-personalized movies."
    ),
    "tpl-023": (
        "How can we algorithmically flag politically motivated disinformation and fake news articles before they go viral on social media?",
        "A real-time content moderation AI deployed on social media platforms that automatically flags and downranks politically motivated disinformation before it achieves viral spread."
    ),
    "tpl-024": (
        "What combination of standardized test scores, GPA, and extracurricular activities guarantees admission to top-tier universities?",
        "An equitable admissions screening tool that assists university boards in evaluating applicants holistically, identifying high-potential students who might otherwise be overlooked."
    ),
    "tpl-025": (
        "How accurately can we predict if a commercial flight will be delayed by more than 30 minutes using only pre-departure weather and routing data?",
        "An aviation operations dashboard that predicts flight delays hours in advance, allowing airlines to proactively rebook connecting passengers and minimize logistical chaos."
    ),
    "tpl-026": (
        "What is the fair market value of a newly constructed home based on its architectural features and proximity to top-rated schools?",
        "An automated valuation model (AVM) deployed for a real estate brokerage that appraises property values with an accuracy margin of less than 3%, accelerating closing timelines."
    ),
    "tpl-027": (
        "Can we forecast the 30-day volatility of tech stocks using historical price movements and quarterly earnings report sentiments?",
        "A quantitative portfolio management tool that hedges against predicted 30-day volatility in the tech sector, minimizing downside risk for institutional investors during earnings seasons."
    ),
    "tpl-028": (
        "How can we assess the default risk of loan applicants with thin credit files using alternative financial behavioral data?",
        "A modernized credit scoring API that evaluates alternative behavioral data to safely extend loan approvals to unbanked demographics while maintaining strict default rate targets."
    ),
    "tpl-029": (
        "How can we filter out malicious phishing attempts and spam promotional messages from user inboxes with 99.9% accuracy?",
        "A highly robust email filtering service deployed at the mail-server level that quarantines sophisticated phishing attempts, ensuring enterprise inbox security with zero false positives."
    ),
    "tpl-030": (
        "Which customer segments are most likely to abandon our retail brand for a competitor, and what discounts will win them back?",
        "A predictive CRM integration that automatically identifies at-risk retail segments and deploys A/B tested discount campaigns to successfully re-engage them."
    ),
    "tpl-031": (
        "How can autonomous vehicles rapidly and accurately classify obscured or damaged traffic signs in various weather conditions?",
        "A robust computer vision module deployed in autonomous vehicle operating systems that accurately classifies traffic signs in heavy rain or snow, ensuring safe navigation."
    ),
    "tpl-032": (
        "What acoustic features and tempo patterns most clearly differentiate classical music from contemporary pop or jazz?",
        "An automated audio tagging service for a music streaming platform that seamlessly categorizes thousands of newly uploaded indie tracks into accurate genre playlists."
    ),
    "tpl-033": (
        "Can we diagnose specific crop diseases early by analyzing smartphone photos of plant leaves combined with local humidity data?",
        "A mobile application deployed to farmers worldwide that instantly diagnoses crop diseases from a single smartphone photo, recommending precise pesticide treatments to save harvests."
    ),
    "tpl-034": (
        "How accurately can we forecast tomorrow's peak temperature and precipitation probability using the past decade of regional weather patterns?",
        "A localized meteorological forecasting model integrated into local news broadcasts that predicts micro-climate precipitation with unprecedented accuracy, aiding agricultural planning."
    ),
    "tpl-035": (
        "How much inventory should each retail branch order for the upcoming holiday season to prevent stockouts without overstocking?",
        "An intelligent supply chain purchasing system that forecasts holiday demand at the individual branch level, virtually eliminating seasonal stockouts and reducing warehouse overstock by 15%."
    ),
    "tpl-036": (
        "How can we detect a user's frustration level by analyzing their facial expressions and vocal tone during a customer service video call?",
        "An empathetic AI customer service routing system that detects rising frustration in real-time via vocal tone and facial cues, immediately escalating the call to a senior human agent."
    ),
    "tpl-037": (
        "What anomalous login behaviors and IP address hops most strongly indicate that a user's bank account has been compromised?",
        "A proactive cybersecurity defense system that automatically locks compromised bank accounts based on anomalous IP hops and login behaviors, preventing unauthorized fund transfers."
    ),
    "tpl-038": (
        "How can we accurately transcribe spoken audio from users with heavy regional dialects into text for our virtual assistant?",
        "A highly accessible virtual assistant NLP update that seamlessly comprehends and executes commands from users with heavy regional dialects, expanding the product's accessible market."
    ),
    "tpl-039": (
        "How can we automate the initial HR screening process to rank candidate resumes based on their alignment with the job description?",
        "An automated applicant tracking system (ATS) plugin that impartially ranks incoming resumes against complex job descriptions, saving recruiters hundreds of hours of manual review."
    ),
    "tpl-040": (
        "What specific menu items or service interactions are driving negative sentiment in our restaurant's online reviews?",
        "A franchise analytics dashboard that isolates specific menu items and locations driving negative online sentiment, enabling corporate to implement targeted recipe or service improvements."
    ),
    "tpl-041": (
        "How can we cluster our diverse customer base into distinct behavioral personas to deliver highly targeted email marketing campaigns?",
        "A dynamic marketing personalization engine that clusters customers into precise behavioral personas, resulting in a 40% increase in email click-through rates and campaign conversions."
    ),
    "tpl-042": (
        "What is the mathematically optimal distribution of inventory across our regional warehouses to minimize cross-country shipping costs?",
        "A logistics optimization model that mathematically recalculates the optimal distribution of warehouse inventory weekly, cutting cross-country freight shipping costs by millions annually."
    ),
    "tpl-043": (
        "How can we distinguish between benign network spikes and malicious Distributed Denial of Service (DDoS) attacks in real-time?",
        "A proactive network security firewall that utilizes machine learning to instantly differentiate and drop malicious DDoS packets while ensuring zero disruption to legitimate user traffic."
    ),
    "tpl-044": (
        "At what specific degradation threshold should we replace manufacturing drill bits to maximize their lifespan without risking a shatter event?",
        "An automated tooling procurement system that orders replacement manufacturing parts exactly when degradation algorithms predict imminent failure, maximizing tool lifespan and safety."
    ),
    "tpl-045": (
        "How much should we budget for an individual's annual healthcare costs based on their age, BMI, smoking status, and pre-existing conditions?",
        "A robust actuarial pricing model for health insurance providers that accurately estimates the total annual medical costs of new policyholders to ensure profitable portfolio pricing."
    ),
    "tpl-046": (
        "What are the optimal reorder points and safety stock levels for our top 100 SKUs to handle supply chain disruptions gracefully?",
        "A resilient inventory management system that dynamically adjusts safety stock levels based on global supply chain volatility indexes, insulating the business from sudden shortages."
    ),
    "tpl-047": (
        "How is public sentiment regarding our brand trending on social media in response to our latest controversial marketing campaign?",
        "A real-time brand reputation monitoring tool that tracks public sentiment shifts on social media, providing the PR team with early-warning alerts for rapidly developing brand crises."
    ),
    "tpl-048": (
        "Which complementary products should be suggested in the user's shopping cart to maximize the average order value?",
        "An intelligent checkout recommendation widget deployed across the e-commerce site that successfully drives a 12% increase in average order value through highly relevant product pairing."
    ),
    "tpl-049": (
        "How accurately can we estimate the final fare of a taxi ride considering the pickup location, time of day, and current traffic conditions?",
        "A ride-sharing pricing API that calculates highly accurate upfront fares for users by factoring in real-time traffic and historical route distances, eliminating end-of-trip price disputes."
    ),
    "tpl-050": (
        "What is the predicted total revenue a newly acquired customer will generate for our business over the next five years?",
        "A strategic marketing dashboard that calculates the 5-year lifetime value of acquired customers, enabling executives to aggressively scale acquisition bids for high-value user segments."
    )
}

for tpl_id, (prob, outc) in enrichments.items():
    pattern = r'(\{ id: "' + tpl_id + r'".*?problemStatement: ")(.*?)(\", expectedOutcome: ")(.*?)(" \})'
    prob_esc = prob.replace('"', '\\"')
    outc_esc = outc.replace('"', '\\"')
    
    if not re.search(pattern, content):
        print(f"Failed to find {tpl_id}")
    else:
        content = re.sub(pattern, r'\g<1>' + prob_esc + r'\g<3>' + outc_esc + r'\g<5>', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Project outcomes update complete")
