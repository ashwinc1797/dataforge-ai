import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Play, ArrowRight, ShoppingCart, Activity, CreditCard, Users, Shield, BookOpen, Truck, Building2, Factory, Globe, Home, Hotel, Phone, TrendingUp, BarChart, Store, Star, HeartPulse, AlertOctagon, UserMinus, Car, Laptop, X } from "lucide-react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, any> = {
  "shopping-cart": ShoppingCart,
  "activity": Activity,
  "credit-card": CreditCard,
  "users": Users,
  "shield": Shield,
  "book-open": BookOpen,
  "truck": Truck,
  "building": Building2,
  "factory": Factory,
  "globe": Globe,
  "home": Home,
  "hotel": Hotel,
  "phone": Phone,
  "trending-up": TrendingUp,
  "bar-chart": BarChart,
  "store": Store,
  "star": Star,
  "heart-pulse": HeartPulse,
  "alert-octagon": AlertOctagon,
  "user-minus": UserMinus,
  "car": Car,
  "laptop": Laptop
};

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setTemplates([
        { id: "tpl-001", name: "Blinkit Sales", description: "Quick commerce 10-minute delivery dataset with orders, riders, and inventory.", domain: "Ecommerce", icon: "shopping-cart", problemStatement: "How can we minimize delivery SLA breaches and optimize rider allocation during peak demand hours?", expectedOutcome: "A deployed intelligent routing system that dynamically assigns riders to multi-stop delivery routes in real-time, reducing late deliveries by 40% and improving overall fleet efficiency." },
        { id: "tpl-002", name: "Hospital Management", description: "Comprehensive healthcare dataset with patients, doctors, appointments, and billing.", domain: "Healthcare", icon: "activity", problemStatement: "What are the key bottlenecks causing prolonged patient wait times, and how can doctor shifts be scheduled to maximize throughput?", expectedOutcome: "An automated hospital resource scheduling dashboard that predicts patient influx and optimizes doctor shifts, successfully decreasing average patient wait times by 25%." },
        { id: "tpl-003", name: "Bank Transactions", description: "High-volume transaction data suitable for fraud detection and financial modeling.", domain: "Banking", icon: "credit-card", problemStatement: "How can we identify and block unauthorized transactions in real-time without increasing false positives that frustrate legitimate customers?", expectedOutcome: "A highly accurate anomaly detection API that intercepts fraudulent banking transactions with sub-50ms latency, preventing millions in chargebacks while keeping false positives below 0.1%." },
        { id: "tpl-004", name: "HR Analytics", description: "Employee records, performance reviews, attrition metrics, and salaries.", domain: "HR", icon: "users", problemStatement: "Which high-performing employees are at the highest risk of attrition, and what compensation or cultural factors are driving their dissatisfaction?", expectedOutcome: "An HR retention platform that flags at-risk top talent and recommends targeted intervention strategies (e.g., salary adjustments or role changes) to reduce voluntary turnover by 15%." },
        { id: "tpl-005", name: "Insurance Claims", description: "Policyholders, claims history, payouts, and fraud indicators.", domain: "Insurance", icon: "shield", problemStatement: "How can we expedite legitimate claim payouts while automatically flagging statistically improbable claims for manual fraud investigation?", expectedOutcome: "A machine learning pipeline that auto-approves low-risk insurance claims instantly while intelligently routing high-risk anomalies to specialized investigators, cutting processing time in half." },
        { id: "tpl-006", name: "Student Performance", description: "Demographics, test scores, attendance, and extracurriculars.", domain: "Education", icon: "book-open", problemStatement: "What early warning signs in attendance and assignment grades indicate a student is at risk of failing the final exam?", expectedOutcome: "An early-intervention tracking system for educators that accurately identifies struggling students by week four, allowing targeted tutoring that improves overall class pass rates." },
        { id: "tpl-007", name: "Smart Factory Sensors", description: "IoT sensor data from manufacturing equipment, predicting maintenance needs.", domain: "Manufacturing", icon: "factory", problemStatement: "How can we predict imminent machine failures to schedule preventative maintenance before catastrophic assembly line downtime occurs?", expectedOutcome: "A predictive maintenance alerting system that analyzes live IoT sensor data to forecast equipment degradation, successfully preventing unexpected factory downtime and saving millions in lost production." },
        { id: "tpl-008", name: "Global Supply Chain", description: "Shipment tracking, warehouse inventory, and logistics route optimization data.", domain: "Logistics", icon: "globe", problemStatement: "Where are the structural delays in our global shipping network, and how can we reroute cargo to minimize fuel costs and transit times?", expectedOutcome: "An advanced supply chain optimization engine that dynamically reroutes global shipments based on weather and port congestion, resulting in a 10% reduction in total logistics overhead." },
        { id: "tpl-009", name: "Real Estate Listings", description: "Property details, pricing, locations, and real estate agent performance metrics.", domain: "Real Estate", icon: "home", problemStatement: "Which property features (e.g., square footage, neighborhood amenities) most heavily influence housing valuations in a volatile market?", expectedOutcome: "A consumer-facing real estate pricing estimator tool that provides accurate, localized property valuations to buyers and sellers, outperforming traditional comparative market analysis." },
        { id: "tpl-010", name: "Hotel Reservations", description: "Booking records, room availability, guest preferences, and cancellation logs.", domain: "Hospitality", icon: "hotel", problemStatement: "How can we predict the probability of a guest canceling their reservation to dynamically adjust overbooking limits and maximize occupancy?", expectedOutcome: "A revenue management algorithm that dynamically adjusts hotel overbooking limits based on cancellation probabilities, maximizing room occupancy rates without risking guest walk-outs." },
        { id: "tpl-011", name: "Telecommunications Churn", description: "Customer usage patterns, support tickets, and subscription cancellations.", domain: "Telecom", icon: "phone", problemStatement: "Which subscribers are demonstrating behavioral patterns indicative of imminent churn, and what retention offers are most likely to save them?", expectedOutcome: "A targeted customer retention engine that identifies users likely to cancel their subscriptions and automatically deploys personalized discount offers, recovering 20% of potential churners." },
        { id: "tpl-012", name: "Marketing Campaign Metrics", description: "Ad spend, click-through rates, conversion events, and ROI analysis.", domain: "Marketing", icon: "trending-up", problemStatement: "How should we allocate our multi-million dollar marketing budget across social, search, and email channels to maximize customer acquisition ROI?", expectedOutcome: "A multi-touch attribution dashboard that reallocates marketing spend across digital channels in real-time, driving a 30% increase in customer acquisition while maintaining the same budget." },
        { id: "tpl-013", name: "Stock Market Ticker", description: "High-frequency financial trading data, stock prices, and volume over time.", domain: "Finance", icon: "bar-chart", problemStatement: "Are there arbitrage opportunities or predictive momentum indicators hidden within high-frequency ticker data during market open hours?", expectedOutcome: "A fully automated algorithmic trading bot that executes high-frequency trades based on predictive momentum indicators, consistently outperforming baseline market indexes." },
        { id: "tpl-014", name: "Retail Store POS", description: "Point-of-sale transactions, barcode scans, cashier shifts, and daily revenue.", domain: "Retail", icon: "store", problemStatement: "What items are most frequently purchased together, and how should store layouts be redesigned to maximize cross-selling opportunities?", expectedOutcome: "An optimized physical store layout and digital recommendation system driven by market basket analysis, resulting in a measurable increase in average customer basket size." },
        { id: "tpl-015", name: "E-commerce Product Reviews", description: "Customer feedback, text reviews, star ratings, and sentiment analysis targets.", domain: "Ecommerce", icon: "star", problemStatement: "How can we automatically categorize negative customer reviews to alert the product team about critical defects without manual reading?", expectedOutcome: "An automated NLP triaging pipeline that instantly categorizes incoming e-commerce reviews by sentiment and specific product defect, alerting engineering teams to critical bugs in real-time." },
        { id: "tpl-016", name: "Patient Vitals", description: "Continuous medical monitoring logs, heart rate, blood pressure, and alerts.", domain: "Healthcare", icon: "heart-pulse", problemStatement: "Can we detect the onset of sepsis or cardiac arrest hours before critical failure by analyzing real-time fluctuations in patient vital signs?", expectedOutcome: "A clinical decision support system that analyzes continuous vitals to trigger early warning scores, alerting nurses to deteriorating patient conditions hours before clinical onset." },
        { id: "tpl-017", name: "Credit Card Fraud", description: "Anonymized transactional features with labeled fraudulent anomalies.", domain: "Banking", icon: "alert-octagon", problemStatement: "How can credit card companies detect highly sophisticated fraud rings operating across multiple international accounts?", expectedOutcome: "A graph-based fraud detection architecture that maps relationships between accounts and devices to dismantle coordinated international fraud rings before large-scale extraction occurs." },
        { id: "tpl-018", name: "Employee Attrition", description: "Workforce surveys, promotion history, and likelihood to leave the company.", domain: "HR", icon: "user-minus", problemStatement: "What combination of workload, salary stagnation, and management changes most accurately predicts voluntary employee resignation?", expectedOutcome: "An actionable HR analytics dashboard that maps organizational flight risks, empowering managers to proactively address salary stagnation and workload burnout before talent departs." },
        { id: "tpl-019", name: "Auto Insurance", description: "Vehicular accident reports, car types, repair estimates, and driver histories.", domain: "Insurance", icon: "car", problemStatement: "How can we accurately calculate the risk premium for new auto insurance applicants based on their vehicle type and past driving behavior?", expectedOutcome: "An actuarial risk modeling engine that dynamically prices auto insurance premiums based on deep behavioral and vehicle risk analysis, improving the company's overall loss ratio." },
        { id: "tpl-020", name: "Online Course Analytics", description: "Video watch time, quiz completion rates, student engagement, and dropouts.", domain: "Education", icon: "laptop", problemStatement: "At what specific point in the online curriculum do students lose engagement, and how can we intervene to prevent course dropouts?", expectedOutcome: "An adaptive e-learning platform that detects drops in student engagement and dynamically adjusts curriculum pacing or suggests supplementary materials to prevent course dropouts." },
        // New project templates
        { id: "tpl-021", name: "Library Management System", description: "Books, members, borrowing history, and late fees.", domain: "Education", icon: "book-open", problemStatement: "How can we optimize library inventory purchasing to match community borrowing trends and reduce wait times for popular titles?", expectedOutcome: "A data-driven library procurement system that predicts future community borrowing trends, optimizing budget allocation to ensure popular titles are always available." },
        { id: "tpl-022", name: "Movie Recommendation Engine", description: "Users, movies, genres, ratings, and watch history.", domain: "Ecommerce", icon: "play", problemStatement: "Which movies should we recommend to a user on their homepage to maximize streaming watch time and subscription retention?", expectedOutcome: "A personalized content recommendation engine integrated into the streaming homepage that successfully increases average daily user watch time by suggesting highly relevant, hyper-personalized movies." },
        { id: "tpl-023", name: "Fake News Detection", description: "News articles, authors, sources, and credibility labels.", domain: "Telecom", icon: "globe", problemStatement: "How can we algorithmically flag politically motivated disinformation and fake news articles before they go viral on social media?", expectedOutcome: "A real-time content moderation AI deployed on social media platforms that automatically flags and downranks politically motivated disinformation before it achieves viral spread." },
        { id: "tpl-024", name: "University Admissions", description: "Applicant scores, GPAs, essays, and admission decisions.", domain: "Education", icon: "users", problemStatement: "What combination of standardized test scores, GPA, and extracurricular activities guarantees admission to top-tier universities?", expectedOutcome: "An equitable admissions screening tool that assists university boards in evaluating applicants holistically, identifying high-potential students who might otherwise be overlooked." },
        { id: "tpl-025", name: "Flight Delay Prediction", description: "Flight schedules, airlines, weather conditions, and delay minutes.", domain: "Logistics", icon: "globe", problemStatement: "How accurately can we predict if a commercial flight will be delayed by more than 30 minutes using only pre-departure weather and routing data?", expectedOutcome: "An aviation operations dashboard that predicts flight delays hours in advance, allowing airlines to proactively rebook connecting passengers and minimize logistical chaos." },
        { id: "tpl-026", name: "Housing Price Predictor", description: "Square footage, bedrooms, neighborhood stats, and sale prices.", domain: "Real Estate", icon: "home", problemStatement: "What is the fair market value of a newly constructed home based on its architectural features and proximity to top-rated schools?", expectedOutcome: "An automated valuation model (AVM) deployed for a real estate brokerage that appraises property values with an accuracy margin of less than 3%, accelerating closing timelines." },
        { id: "tpl-027", name: "Stock Market Analysis", description: "Historical stock prices, trading volumes, and company financials.", domain: "Finance", icon: "bar-chart", problemStatement: "Can we forecast the 30-day volatility of tech stocks using historical price movements and quarterly earnings report sentiments?", expectedOutcome: "A quantitative portfolio management tool that hedges against predicted 30-day volatility in the tech sector, minimizing downside risk for institutional investors during earnings seasons." },
        { id: "tpl-028", name: "Credit Scoring", description: "Applicant credit history, income, existing debt, and default status.", domain: "Banking", icon: "shield", problemStatement: "How can we assess the default risk of loan applicants with thin credit files using alternative financial behavioral data?", expectedOutcome: "A modernized credit scoring API that evaluates alternative behavioral data to safely extend loan approvals to unbanked demographics while maintaining strict default rate targets." },
        { id: "tpl-029", name: "Spam Classifier", description: "Emails, SMS messages, sender info, and spam/ham labels.", domain: "Telecom", icon: "phone", problemStatement: "How can we filter out malicious phishing attempts and spam promotional messages from user inboxes with 99.9% accuracy?", expectedOutcome: "A highly robust email filtering service deployed at the mail-server level that quarantines sophisticated phishing attempts, ensuring enterprise inbox security with zero false positives." },
        { id: "tpl-030", name: "Customer Churn Prediction", description: "Customer demographics, account details, and churn status.", domain: "Retail", icon: "users", problemStatement: "Which customer segments are most likely to abandon our retail brand for a competitor, and what discounts will win them back?", expectedOutcome: "A predictive CRM integration that automatically identifies at-risk retail segments and deploys A/B tested discount campaigns to successfully re-engage them." },
        { id: "tpl-031", name: "Traffic Sign Recognition", description: "Image metadata, bounding boxes, and sign categories.", domain: "Logistics", icon: "car", problemStatement: "How can autonomous vehicles rapidly and accurately classify obscured or damaged traffic signs in various weather conditions?", expectedOutcome: "A robust computer vision module deployed in autonomous vehicle operating systems that accurately classifies traffic signs in heavy rain or snow, ensuring safe navigation." },
        { id: "tpl-032", name: "Music Genre Classification", description: "Audio features, tempo, artists, and genre labels.", domain: "Ecommerce", icon: "activity", problemStatement: "What acoustic features and tempo patterns most clearly differentiate classical music from contemporary pop or jazz?", expectedOutcome: "An automated audio tagging service for a music streaming platform that seamlessly categorizes thousands of newly uploaded indie tracks into accurate genre playlists." },
        { id: "tpl-033", name: "Plant Disease Detection", description: "Leaf image metadata, environmental conditions, and disease labels.", domain: "Education", icon: "factory", problemStatement: "Can we diagnose specific crop diseases early by analyzing smartphone photos of plant leaves combined with local humidity data?", expectedOutcome: "A mobile application deployed to farmers worldwide that instantly diagnoses crop diseases from a single smartphone photo, recommending precise pesticide treatments to save harvests." },
        { id: "tpl-034", name: "Weather Forecasting", description: "Temperature, humidity, wind speed, and precipitation logs.", domain: "Logistics", icon: "globe", problemStatement: "How accurately can we forecast tomorrow's peak temperature and precipitation probability using the past decade of regional weather patterns?", expectedOutcome: "A localized meteorological forecasting model integrated into local news broadcasts that predicts micro-climate precipitation with unprecedented accuracy, aiding agricultural planning." },
        { id: "tpl-035", name: "Sales Forecasting", description: "Historical daily sales, promotional events, and holidays.", domain: "Retail", icon: "store", problemStatement: "How much inventory should each retail branch order for the upcoming holiday season to prevent stockouts without overstocking?", expectedOutcome: "An intelligent supply chain purchasing system that forecasts holiday demand at the individual branch level, virtually eliminating seasonal stockouts and reducing warehouse overstock by 15%." },
        { id: "tpl-036", name: "Emotion Recognition", description: "Facial expression metadata, voice tone scores, and emotion labels.", domain: "Healthcare", icon: "users", problemStatement: "How can we detect a user's frustration level by analyzing their facial expressions and vocal tone during a customer service video call?", expectedOutcome: "An empathetic AI customer service routing system that detects rising frustration in real-time via vocal tone and facial cues, immediately escalating the call to a senior human agent." },
        { id: "tpl-037", name: "Fraud Detection", description: "User actions, IP addresses, login attempts, and fraud flags.", domain: "Banking", icon: "alert-octagon", problemStatement: "What anomalous login behaviors and IP address hops most strongly indicate that a user's bank account has been compromised?", expectedOutcome: "A proactive cybersecurity defense system that automatically locks compromised bank accounts based on anomalous IP hops and login behaviors, preventing unauthorized fund transfers." },
        { id: "tpl-038", name: "Speech Recognition", description: "Audio transcripts, speaker demographics, and dialect info.", domain: "Telecom", icon: "phone", problemStatement: "How can we accurately transcribe spoken audio from users with heavy regional dialects into text for our virtual assistant?", expectedOutcome: "A highly accessible virtual assistant NLP update that seamlessly comprehends and executes commands from users with heavy regional dialects, expanding the product's accessible market." },
        { id: "tpl-039", name: "Resume Screening", description: "Applicant skills, experience years, education, and interview scores.", domain: "HR", icon: "book-open", problemStatement: "How can we automate the initial HR screening process to rank candidate resumes based on their alignment with the job description?", expectedOutcome: "An automated applicant tracking system (ATS) plugin that impartially ranks incoming resumes against complex job descriptions, saving recruiters hundreds of hours of manual review." },
        { id: "tpl-040", name: "Restaurant Reviews Sentiment", description: "Diner reviews, dish ratings, service scores, and sentiment.", domain: "Hospitality", icon: "hotel", problemStatement: "What specific menu items or service interactions are driving negative sentiment in our restaurant's online reviews?", expectedOutcome: "A franchise analytics dashboard that isolates specific menu items and locations driving negative online sentiment, enabling corporate to implement targeted recipe or service improvements." },
        { id: "tpl-041", name: "Customer Segmentation", description: "Purchase history, browsing behavior, and demographic clusters.", domain: "Marketing", icon: "users", problemStatement: "How can we cluster our diverse customer base into distinct behavioral personas to deliver highly targeted email marketing campaigns?", expectedOutcome: "A dynamic marketing personalization engine that clusters customers into precise behavioral personas, resulting in a 40% increase in email click-through rates and campaign conversions." },
        { id: "tpl-042", name: "Supply Chain Optimization", description: "Supplier lead times, shipping costs, and warehouse capacities.", domain: "Manufacturing", icon: "truck", problemStatement: "What is the mathematically optimal distribution of inventory across our regional warehouses to minimize cross-country shipping costs?", expectedOutcome: "A logistics optimization model that mathematically recalculates the optimal distribution of warehouse inventory weekly, cutting cross-country freight shipping costs by millions annually." },
        { id: "tpl-043", name: "Network Intrusion Detection", description: "Network packets, protocols, source IPs, and attack types.", domain: "Telecom", icon: "shield", problemStatement: "How can we distinguish between benign network spikes and malicious Distributed Denial of Service (DDoS) attacks in real-time?", expectedOutcome: "A proactive network security firewall that utilizes machine learning to instantly differentiate and drop malicious DDoS packets while ensuring zero disruption to legitimate user traffic." },
        { id: "tpl-044", name: "Predictive Maintenance", description: "Machine runtimes, maintenance logs, and failure events.", domain: "Manufacturing", icon: "factory", problemStatement: "At what specific degradation threshold should we replace manufacturing drill bits to maximize their lifespan without risking a shatter event?", expectedOutcome: "An automated tooling procurement system that orders replacement manufacturing parts exactly when degradation algorithms predict imminent failure, maximizing tool lifespan and safety." },
        { id: "tpl-045", name: "Healthcare Cost Prediction", description: "Patient demographics, pre-existing conditions, and medical costs.", domain: "Insurance", icon: "activity", problemStatement: "How much should we budget for an individual's annual healthcare costs based on their age, BMI, smoking status, and pre-existing conditions?", expectedOutcome: "A robust actuarial pricing model for health insurance providers that accurately estimates the total annual medical costs of new policyholders to ensure profitable portfolio pricing." },
        { id: "tpl-046", name: "Inventory Management", description: "Stock levels, reorder points, lead times, and daily demand.", domain: "Retail", icon: "shopping-cart", problemStatement: "What are the optimal reorder points and safety stock levels for our top 100 SKUs to handle supply chain disruptions gracefully?", expectedOutcome: "A resilient inventory management system that dynamically adjusts safety stock levels based on global supply chain volatility indexes, insulating the business from sudden shortages." },
        { id: "tpl-047", name: "Social Media Sentiment Analysis", description: "Tweets, posts, hashtags, and public sentiment scores.", domain: "Marketing", icon: "trending-up", problemStatement: "How is public sentiment regarding our brand trending on social media in response to our latest controversial marketing campaign?", expectedOutcome: "A real-time brand reputation monitoring tool that tracks public sentiment shifts on social media, providing the PR team with early-warning alerts for rapidly developing brand crises." },
        { id: "tpl-048", name: "E-commerce Product Recommendation", description: "User clicks, cart additions, purchases, and product features.", domain: "Ecommerce", icon: "laptop", problemStatement: "Which complementary products should be suggested in the user's shopping cart to maximize the average order value?", expectedOutcome: "An intelligent checkout recommendation widget deployed across the e-commerce site that successfully drives a 12% increase in average order value through highly relevant product pairing." },
        { id: "tpl-049", name: "Taxi Fare Prediction", description: "Pickup/dropoff locations, timestamps, distances, and fares.", domain: "Logistics", icon: "car", problemStatement: "How accurately can we estimate the final fare of a taxi ride considering the pickup location, time of day, and current traffic conditions?", expectedOutcome: "A ride-sharing pricing API that calculates highly accurate upfront fares for users by factoring in real-time traffic and historical route distances, eliminating end-of-trip price disputes." },
        { id: "tpl-050", name: "Customer Lifetime Value", description: "Acquisition costs, historical revenue, and retention rates.", domain: "Marketing", icon: "bar-chart", problemStatement: "What is the predicted total revenue a newly acquired customer will generate for our business over the next five years?", expectedOutcome: "A strategic marketing dashboard that calculates the 5-year lifetime value of acquired customers, enabling executives to aggressively scale acquisition bids for high-value user segments." }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Template Gallery</h1>
        <p className="text-muted-foreground mt-1">Start quickly with pre-configured industry standard datasets and project topics.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => {
            const Icon = iconMap[template.icon] || LayoutTemplate;
            return (
              <Card key={template.id} className="group hover:border-primary/50 hover:shadow-md transition-all flex flex-col cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px] text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                    {template.domain}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary/5"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    Use Template <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Overlay for Template Confirmation */}
      {selectedTemplate && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setSelectedTemplate(null)}
        >
          <Card 
            className="w-full max-w-lg mx-4 shadow-xl border-primary/20 animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <CardHeader className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-4"
                onClick={() => setSelectedTemplate(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LayoutTemplate className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedTemplate.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-primary mt-1">{selectedTemplate.domain} Template</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50 shadow-sm">
                <h4 className="font-semibold text-sm mb-2 text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Problem Statement
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedTemplate.problemStatement || selectedTemplate.description}
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50 shadow-sm">
                <h4 className="font-semibold text-sm mb-2 text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Expected Outcome
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedTemplate.expectedOutcome || "Generates a fully connected relational dataset ready for model training, dashboarding, or database seeding."}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-6 border-t bg-muted/10">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>Cancel</Button>
              <Button onClick={() => navigate('/modeling', { state: { domain: selectedTemplate.domain } })} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-md">
                Configure Model <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
