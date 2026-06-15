(function () {
  function round2(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }

  function calcWage(hourlyRate, regularHours, overtimeHours, overtimeRate, weekendHours, weekendRate, publicHolidayHours, publicHolidayRate) {
    return round2(
      hourlyRate * regularHours +
      hourlyRate * overtimeRate * overtimeHours +
      hourlyRate * weekendRate * weekendHours +
      hourlyRate * publicHolidayRate * publicHolidayHours
    );
  }

  function calcCommission(sales, commissionRate) {
    return round2(sales * commissionRate);
  }

  function calcPieceWork(items, ratePerItem) {
    return round2(items * ratePerItem);
  }

  function calcRoyalty(copies, royaltyPerCopy) {
    return round2(copies * royaltyPerCopy);
  }

  function convertFromWeekly(weekly) {
    const yearly = weekly * 52;
    return {
      weekly: round2(weekly),
      fortnightly: round2(weekly * 2),
      monthly: round2(yearly / 12),
      yearly: round2(yearly)
    };
  }

  function calcLeaveLoading(normalPay, loadingRate) {
    return round2(normalPay * loadingRate);
  }

  function lookupPaygWeeklyTax(weeklyGross) {
    if (weeklyGross <= 359) return 0;
    if (weeklyGross <= 438) return round2((weeklyGross - 359) * 0.16);
    if (weeklyGross <= 548) return round2(13 + (weeklyGross - 438) * 0.19);
    if (weeklyGross <= 721) return round2(34 + (weeklyGross - 548) * 0.325);
    return round2(90 + (weeklyGross - 721) * 0.37);
  }

  function calcTaxableIncome(grossAnnual, deductions) {
    return round2(Math.max(0, grossAnnual - deductions));
  }

  function calcAnnualTax(taxableIncome) {
    const t = taxableIncome;
    if (t <= 18200) return 0;
    if (t <= 45000) return round2((t - 18200) * 0.16);
    if (t <= 135000) return round2(4288 + (t - 45000) * 0.30);
    if (t <= 190000) return round2(31288 + (t - 135000) * 0.37);
    return round2(51638 + (t - 190000) * 0.45);
  }

  function calcNetEarnings(grossAnnual, deductions) {
    const taxable = calcTaxableIncome(grossAnnual, deductions);
    const tax = calcAnnualTax(taxable);
    return {
      taxable,
      tax,
      net: round2(grossAnnual - deductions - tax)
    };
  }

  function simpleInterest(principal, rate, periods) {
    const interest = round2(principal * rate * periods);
    return {
      interest,
      total: round2(principal + interest)
    };
  }

  function costOnTerms(price, deposit, repayment, repaymentsCount) {
    const total = round2(deposit + repayment * repaymentsCount);
    return {
      total,
      extra: round2(total - price)
    };
  }

  function bnplCost(price, installments, feePerInstallment, lateFee) {
    const fees = installments * feePerInstallment + (lateFee || 0);
    return round2(price + fees);
  }

  function shortTermLoanCost(principal, establishmentFee, monthlyFee, months) {
    return round2(principal + establishmentFee + monthlyFee * months);
  }

  function buildMissions() {
    return [
      {
        title: 'Wage Shift Puzzle',
        story: 'You work at Harbour Cafe and need to check your weekly pay packet.',
        question: 'Hourly rate $30, regular 30h, overtime 5h at 1.5x, weekend 4h at 1.75x, public holiday 2h at 2.5x. What are total wages?',
        answer: calcWage(30, 30, 5, 1.5, 4, 1.75, 2, 2.5)
      },
      {
        title: 'Creator Side Hustle',
        story: 'Your friend sells art and music online.',
        question: 'Sales $4200 at 7% commission, piece work 36 items at $12, royalties 580 downloads at $0.45. Total non-wage earnings?',
        answer: round2(calcCommission(4200, 0.07) + calcPieceWork(36, 12) + calcRoyalty(580, 0.45))
      },
      {
        title: 'Pay Cycle Planner',
        story: 'You want to budget from a weekly income.',
        question: 'If weekly earnings are $980, what is the monthly amount using 52 weeks in a year?',
        answer: convertFromWeekly(980).monthly
      },
      {
        title: 'Holiday Bonus',
        story: 'You are checking leave loading before booking a trip.',
        question: 'Normal pay for leave period is $1,540 and leave loading is 17.5%. How much leave loading is added?',
        answer: calcLeaveLoading(1540, 0.175)
      },
      {
        title: 'PAYG Check',
        story: 'Use the weekly PAYG table to estimate withheld tax.',
        question: 'For weekly gross pay of $680, how much tax is withheld?',
        answer: lookupPaygWeeklyTax(680)
      },
      {
        title: 'Taxable Income',
        story: 'Time to prepare annual tax figures.',
        question: 'Gross annual income is $78,000 and deductions are $4,600. What is annual taxable income?',
        answer: calcTaxableIncome(78000, 4600)
      },
      {
        title: 'Net Earnings',
        story: 'Now find what stays in your pocket after tax.',
        question: 'Use gross income $78,000 and deductions $4,600. What is net annual earnings after tax?',
        answer: calcNetEarnings(78000, 4600).net
      },
      {
        title: 'Simple Interest Investment',
        story: 'You invest in a school enterprise project.',
        question: 'Principal $2,500 at 6% simple interest per year for 4 years. What is simple interest earned?',
        answer: simpleInterest(2500, 0.06, 4).interest
      },
      {
        title: 'Simple Interest Total Value',
        story: 'Track total value of a simple-interest account.',
        question: 'Principal $1,800 at 5.5% simple interest per year for 3 years. What is final total value?',
        answer: simpleInterest(1800, 0.055, 3).total
      },
      {
        title: 'Spending Options',
        story: 'Choose the cheapest way to buy a laptop.',
        question: 'Cash price $1,200. Terms: $200 deposit + 10 repayments of $115. What is the extra cost above cash price?',
        answer: costOnTerms(1200, 200, 115, 10).extra
      }
    ];
  }

  function drawSimpleInterestChart(canvas, principal, rate, years) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const points = [];
    let maxValue = principal;
    for (let y = 0; y <= years; y += 1) {
      const total = simpleInterest(principal, rate, y).total;
      points.push({ y, total });
      if (total > maxValue) maxValue = total;
    }

    const pad = 30;
    const chartW = width - pad * 2;
    const chartH = height - pad * 2;

    ctx.strokeStyle = '#8aa2c8';
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, height - pad);
    ctx.lineTo(width - pad, height - pad);
    ctx.stroke();

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();

    points.forEach(function (point, index) {
      const x = pad + (years === 0 ? 0 : point.y / years) * chartW;
      const y = height - pad - (point.total / maxValue) * chartH;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = '#e5e7eb';
    ctx.font = '12px sans-serif';
    ctx.fillText('$0', 6, height - pad + 4);
    ctx.fillText('$' + round2(maxValue), 2, pad - 6);
    ctx.fillText('Years: 0-' + years, width - 95, height - 8);
  }

  function setupUI() {
    if (typeof document === 'undefined') return;

    const missions = buildMissions();
    const completed = new Set();
    let score = 0;
    let currentMission = 0;

    const missionList = document.getElementById('missionList');
    const missionCard = document.getElementById('missionCard');
    const missionTitle = document.getElementById('missionTitle');
    const missionStory = document.getElementById('missionStory');
    const missionQuestion = document.getElementById('missionQuestion');
    const answerInput = document.getElementById('answerInput');
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    const nextMissionBtn = document.getElementById('nextMissionBtn');
    const feedback = document.getElementById('feedback');
    const scoreEl = document.getElementById('score');
    const progressEl = document.getElementById('progress');

    const principalInput = document.getElementById('principalInput');
    const rateInput = document.getElementById('rateInput');
    const yearsInput = document.getElementById('yearsInput');
    const plotBtn = document.getElementById('plotBtn');
    const chartCanvas = document.getElementById('interestChart');
    const simpleInterestSummary = document.getElementById('simpleInterestSummary');

    const bnplPrice = document.getElementById('bnplPrice');
    const bnplInst = document.getElementById('bnplInst');
    const bnplFee = document.getElementById('bnplFee');
    const loanPrincipal = document.getElementById('loanPrincipal');
    const loanEst = document.getElementById('loanEst');
    const loanMonthly = document.getElementById('loanMonthly');
    const loanMonths = document.getElementById('loanMonths');
    const compareSpendBtn = document.getElementById('compareSpendBtn');
    const spendSummary = document.getElementById('spendSummary');

    function refreshHeader() {
      scoreEl.textContent = 'Score: ' + score;
      progressEl.textContent = 'Missions complete: ' + completed.size + '/' + missions.length;
    }

    function showMission(index) {
      currentMission = index;
      const mission = missions[index];
      missionCard.hidden = false;
      missionTitle.textContent = mission.title;
      missionStory.textContent = mission.story;
      missionQuestion.textContent = mission.question;
      answerInput.value = '';
      feedback.textContent = '';
      feedback.className = '';
      answerInput.focus();
    }

    missions.forEach(function (mission, index) {
      const btn = document.createElement('button');
      btn.textContent = (index + 1) + '. ' + mission.title;
      btn.addEventListener('click', function () {
        showMission(index);
      });
      missionList.appendChild(btn);
    });

    checkAnswerBtn.addEventListener('click', function () {
      const userAnswer = Number(answerInput.value);
      if (!Number.isFinite(userAnswer)) {
        feedback.textContent = 'Enter a numeric answer.';
        feedback.className = 'bad';
        return;
      }
      const expected = missions[currentMission].answer;
      const ok = Math.abs(userAnswer - expected) < 0.01;
      if (ok) {
        feedback.textContent = 'Correct. +' + (completed.has(currentMission) ? 0 : 10) + ' points.';
        feedback.className = 'good';
        if (!completed.has(currentMission)) {
          completed.add(currentMission);
          score += 10;
        }
      } else {
        feedback.textContent = 'Not yet. Try again. (Hint: round to 2 decimals)';
        feedback.className = 'bad';
      }
      refreshHeader();
    });

    nextMissionBtn.addEventListener('click', function () {
      showMission((currentMission + 1) % missions.length);
    });

    plotBtn.addEventListener('click', function () {
      const p = Number(principalInput.value);
      const r = Number(rateInput.value);
      const n = Number(yearsInput.value);
      if (p < 0 || r < 0 || n < 0 || !Number.isFinite(p + r + n)) return;
      const result = simpleInterest(p, r, n);
      simpleInterestSummary.textContent =
        'Interest = $' + result.interest.toFixed(2) +
        ', Total = $' + result.total.toFixed(2);
      drawSimpleInterestChart(chartCanvas, p, r, n);
    });

    compareSpendBtn.addEventListener('click', function () {
      const bnplTotal = bnplCost(Number(bnplPrice.value), Number(bnplInst.value), Number(bnplFee.value), 0);
      const loanTotal = shortTermLoanCost(Number(loanPrincipal.value), Number(loanEst.value), Number(loanMonthly.value), Number(loanMonths.value));
      const cheaper = bnplTotal <= loanTotal ? 'BNPL' : 'Short-term loan';
      spendSummary.textContent =
        'BNPL total: $' + bnplTotal.toFixed(2) +
        ' | Loan total: $' + loanTotal.toFixed(2) +
        ' | Cheaper option: ' + cheaper;
    });

    refreshHeader();
    showMission(0);
    plotBtn.click();
    compareSpendBtn.click();
  }

  const api = {
    round2,
    calcWage,
    calcCommission,
    calcPieceWork,
    calcRoyalty,
    convertFromWeekly,
    calcLeaveLoading,
    lookupPaygWeeklyTax,
    calcTaxableIncome,
    calcAnnualTax,
    calcNetEarnings,
    simpleInterest,
    costOnTerms,
    bnplCost,
    shortTermLoanCost,
    buildMissions
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (typeof window !== 'undefined') {
    window.FinanceGame = api;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupUI);
    } else {
      setupUI();
    }
  }
})();
