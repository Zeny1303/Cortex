import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function Step3Report({ report }) {
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171717]">
        <p className="text-[#ffdf20] text-lg font-bold">Loading Performance Report...</p>
      </div>
    );
  }
  const navigate = useNavigate()
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for top-tier engineering roles.";
    shortTagline = "Exceptional articulation, clarity, and depth.";
  } else if (finalScore >= 5) {
    performanceText = "Good foundation, minor refinements needed.";
    shortTagline = "Solid technical baseline, practice conciseness.";
  } else {
    performanceText = "Significant practice required.";
    shortTagline = "Focus on structured answers and core concepts.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    // TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 223, 32);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;

    // line
    doc.setDrawColor(255, 223, 32);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    // FINAL SCORE BOX
    doc.setFillColor(23, 23, 23);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

    doc.setFontSize(14);
    doc.setTextColor(255, 223, 32);
    doc.text(
      `Final Score: ${finalScore}/10`,
      pageWidth / 2,
      currentY + 12,
      { align: "center" }
    );

    currentY += 30;

    // SKILLS BOX
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    currentY += 45;

    // ADVICE
    let advice = "";
    if (finalScore >= 8) {
      advice = "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world architectural examples.";
    } else if (finalScore >= 5) {
      advice = "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice = "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    // QUESTION TABLE
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
      },
      headStyles: {
        fillColor: [23, 23, 23],
        textColor: [255, 223, 32],
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: "auto" },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className='min-h-screen bg-[#171717] text-white px-4 sm:px-6 lg:px-10 py-10 selection:bg-[#ffdf20] selection:text-[#111111]'>
      <div className='max-w-6xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
        <div className='w-full flex items-center justify-between gap-4'>
          <button
            onClick={() => navigate("/history")}
            className='p-3.5 rounded-full bg-[#222222] border border-[#ffdf20]/30 text-[#ffdf20] hover:bg-[#ffdf20] hover:text-[#111111] transition-all shadow-md cursor-pointer'>
            <FaArrowLeft size={18} />
          </button>

          <div className='text-center w-full'>
            <h1 className='text-2xl sm:text-4xl font-extrabold text-white tracking-tight'>
              Interview Analytics <span className='text-[#ffdf20]'>Dashboard</span>
            </h1>
            <p className='text-neutral-400 mt-2 text-sm sm:text-base'>
              AI-powered performance insights & score matrix
            </p>
          </div>

          <button onClick={downloadPDF} className='bg-[#ffdf20] hover:bg-[#e6c81c] text-[#111111] font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(255,223,32,0.25)] transition-all text-sm sm:text-base whitespace-nowrap cursor-pointer'>
            Download PDF
          </button>
        </div>
      </div>

      <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
        {/* Left Column - Score & Skills */}
        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#222222] border border-neutral-800 rounded-3xl shadow-xl p-6 sm:p-8 text-center relative overflow-hidden">
            <div className='absolute top-0 right-0 w-32 h-32 bg-[#ffdf20]/10 rounded-full blur-3xl pointer-events-none'></div>

            <h3 className="text-neutral-400 mb-6 text-sm font-semibold uppercase tracking-wider">
              Overall Performance Score
            </h3>

            <div className='relative w-28 h-28 sm:w-32 sm:h-32 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "20px",
                  pathColor: "#ffdf20",
                  textColor: "#ffffff",
                  trailColor: "#333333",
                })}
              />
            </div>

            <div className="mt-6 border-t border-neutral-800 pt-4">
              <p className="font-bold text-[#ffdf20] text-base sm:text-lg">
                {performanceText}
              </p>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                {shortTagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='bg-[#222222] border border-neutral-800 rounded-3xl shadow-xl p-6 sm:p-8'>
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 tracking-tight">
              Skill Evaluation Matrix
            </h3>

            <div className='space-y-5'>
              {skills.map((s, i) => (
                <div key={i}>
                  <div className='flex justify-between mb-2 text-sm'>
                    <span className='text-neutral-300 font-medium'>{s.label}</span>
                    <span className='font-bold text-[#ffdf20]'>{s.value}/10</span>
                  </div>

                  <div className='bg-[#171717] h-2.5 rounded-full overflow-hidden border border-neutral-800'>
                    <div 
                      className='bg-[#ffdf20] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,223,32,0.4)]'
                      style={{ width: `${s.value * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Trend & Questions */}
        <div className='lg:col-span-2 space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className='bg-[#222222] border border-neutral-800 rounded-3xl shadow-xl p-6 sm:p-8'>
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 tracking-tight">
              Performance Trend Across Questions
            </h3>

            <div className='h-64 sm:h-72'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                  <XAxis dataKey="name" stroke="#a3a3a3" />
                  <YAxis domain={[0, 10]} stroke="#a3a3a3" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171717', borderColor: '#ffdf20', color: '#fff', borderRadius: '12px' }}
                  />
                  <Area 
                    type="monotone"
                    dataKey="score"
                    stroke="#ffdf20"
                    fill="#ffdf20"
                    fillOpacity={0.2}
                    strokeWidth={3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='bg-[#222222] border border-neutral-800 rounded-3xl shadow-xl p-6 sm:p-8'>
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 tracking-tight">
              Detailed Question Breakdown
            </h3>

            <div className='space-y-5'>
              {questionWiseScore.map((q, i) => (
                <div key={i} className='bg-[#171717] p-5 sm:p-6 rounded-2xl border border-neutral-800 space-y-3'>
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3'>
                    <div>
                      <p className="text-xs text-[#ffdf20] font-bold uppercase tracking-wider mb-1">
                        Question {i + 1}
                      </p>

                      <p className="font-bold text-white text-sm sm:text-base leading-relaxed">
                        {q.question || "Question not available"}
                      </p>
                    </div>

                    <div className='bg-[#ffdf20]/15 text-[#ffdf20] border border-[#ffdf20]/40 px-3.5 py-1 rounded-full font-black text-xs sm:text-sm w-fit shrink-0'>
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  <div className='bg-[#222222] border border-neutral-800 p-4 rounded-xl'>
                    <p className='text-xs text-[#ffdf20] font-bold uppercase tracking-wider mb-1'>
                      AI Feedback & Analysis
                    </p>
                    <p className='text-sm text-neutral-300 leading-relaxed'>
                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available for this question."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Step3Report
