/* =========================================================
   LOANTRACK - MULTIPLE LOANS
   FRONTEND ONLY
   localStorage - NO BACKEND / NO API
========================================================= */


// =========================================================
// STORAGE
// =========================================================

const USERS_KEY = "loanTrackUsers";

const CURRENT_USER_KEY =
    "loanTrackUser";

const LOGIN_KEY =
    "loanTrackLoggedIn";

const LOANS_KEY =
    "loanTrackLoans";

const REMINDER_SETTINGS_KEY =
    "loanTrackReminderSettings";


// =========================================================
// GLOBAL STATE
// =========================================================

let currentUser = null;

let loans = [];

let selectedLoan = null;

let loanChart = null;

let balanceChart = null;


// =========================================================
// DOM READY
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupEventListeners();

        setDefaultStartDate();

        loadReminderSettings();

        checkLogin();

    }
);


// =========================================================
// EVENT LISTENERS
// =========================================================

function setupEventListeners() {


    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            handleRegister
        );

    }


    const loginForm =
        document.getElementById(
            "loginForm"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );

    }


    const showLogin =
        document.getElementById(
            "showLogin"
        );


    if (showLogin) {

        showLogin.addEventListener(
            "click",
            showLoginPage
        );

    }


    const showRegister =
        document.getElementById(
            "showRegister"
        );


    if (showRegister) {

        showRegister.addEventListener(
            "click",
            showRegisterPage
        );

    }


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }


    const loanForm =
        document.getElementById(
            "loanForm"
        );


    if (loanForm) {

        loanForm.addEventListener(
            "submit",
            handleAddLoan
        );

    }


    const resetPayments =
        document.getElementById(
            "resetPayments"
        );


    if (resetPayments) {

        resetPayments.addEventListener(
            "click",
            handleResetPayments
        );

    }


    const saveReminderSettings =
        document.getElementById(
            "saveReminderSettings"
        );


    if (saveReminderSettings) {

        saveReminderSettings.addEventListener(
            "click",
            saveReminderSettingsHandler
        );

    }

}


// =========================================================
// PAGE SWITCHING
// =========================================================

function showLoginPage() {

    document
        .getElementById("registerPage")
        .classList.add("d-none");


    document
        .getElementById("loginPage")
        .classList.remove("d-none");

}


function showRegisterPage() {

    document
        .getElementById("loginPage")
        .classList.add("d-none");


    document
        .getElementById("registerPage")
        .classList.remove("d-none");

}


// =========================================================
// REGISTER
// =========================================================

function handleRegister(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("registerName")
            .value
            .trim();


    const email =
        document
            .getElementById("registerEmail")
            .value
            .trim()
            .toLowerCase();


    const mobile =
        document
            .getElementById("registerMobile")
            .value
            .trim();


    const password =
        document
            .getElementById("registerPassword")
            .value;


    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value;


    const message =
        document.getElementById(
            "registerMessage"
        );


    if (name.length < 2) {

        showMessage(
            message,
            "Please enter a valid name.",
            "error"
        );

        return;

    }


    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email)
    ) {

        showMessage(
            message,
            "Please enter a valid email address.",
            "error"
        );

        return;

    }


    if (
        !/^\d{10}$/.test(mobile)
    ) {

        showMessage(
            message,
            "Mobile number must contain exactly 10 digits.",
            "error"
        );

        return;

    }


    if (password.length < 6) {

        showMessage(
            message,
            "Password must contain at least 6 characters.",
            "error"
        );

        return;

    }


    if (
        password !== confirmPassword
    ) {

        showMessage(
            message,
            "Passwords do not match.",
            "error"
        );

        return;

    }


    const users =
        JSON.parse(
            localStorage.getItem(
                USERS_KEY
            ) || "[]"
        );


    const existing =
        users.find(
            user =>
                user.email === email
        );


    if (existing) {

        showMessage(
            message,
            "An account with this email already exists.",
            "error"
        );

        return;

    }


    const newUser = {

        id:
            Date.now(),

        name,

        email,

        mobile,

        password

    };


    users.push(newUser);


    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );


    showMessage(
        message,
        "Registration successful! You can now login.",
        "success"
    );


    document
        .getElementById("registerForm")
        .reset();


    setTimeout(
        () => {

            showLoginPage();

        },
        800
    );

}


// =========================================================
// LOGIN
// =========================================================

function handleLogin(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById("loginPassword")
            .value;


    const message =
        document.getElementById(
            "loginMessage"
        );


    const users =
        JSON.parse(
            localStorage.getItem(
                USERS_KEY
            ) || "[]"
        );


    const user =
        users.find(
            item =>
                item.email === email &&
                item.password === password
        );


    if (!user) {

        showMessage(
            message,
            "Invalid email or password.",
            "error"
        );

        return;

    }


    currentUser = {

        id:
            user.id,

        name:
            user.name,

        email:
            user.email,

        mobile:
            user.mobile

    };


    sessionStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(currentUser)
    );


    sessionStorage.setItem(
        LOGIN_KEY,
        "true"
    );


    document
        .getElementById("loginForm")
        .reset();


    showMainApp();

    loadLoans();

}


// =========================================================
// CHECK LOGIN
// =========================================================

function checkLogin() {

    const loggedIn =
        sessionStorage.getItem(
            LOGIN_KEY
        );


    const storedUser =
        sessionStorage.getItem(
            CURRENT_USER_KEY
        );


    if (
        loggedIn === "true" &&
        storedUser
    ) {

        try {

            currentUser =
                JSON.parse(
                    storedUser
                );


            showMainApp();

            loadLoans();

        } catch (error) {

            console.error(error);

            logout();

        }

    }

}


// =========================================================
// SHOW MAIN APP
// =========================================================

function showMainApp() {

    document
        .getElementById("registerPage")
        .classList.add("d-none");


    document
        .getElementById("loginPage")
        .classList.add("d-none");


    document
        .getElementById("mainApp")
        .classList.remove("d-none");


    updateProfile();

}


// =========================================================
// UPDATE PROFILE
// =========================================================

function updateProfile() {

    if (!currentUser) {
        return;
    }


    const userName =
        document.getElementById(
            "userName"
        );


    const navUserName =
        document.getElementById(
            "navUserName"
        );


    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    const profileMobile =
        document.getElementById(
            "profileMobile"
        );


    if (userName) {

        userName.textContent =
            currentUser.name;

    }


    if (navUserName) {

        navUserName.textContent =
            currentUser.name;

    }


    if (profileName) {

        profileName.value =
            currentUser.name;

    }


    if (profileEmail) {

        profileEmail.value =
            currentUser.email;

    }


    if (profileMobile) {

        profileMobile.value =
            currentUser.mobile;

    }

}


// =========================================================
// LOGOUT
// =========================================================

function logout() {

    sessionStorage.removeItem(
        CURRENT_USER_KEY
    );


    sessionStorage.removeItem(
        LOGIN_KEY
    );


    currentUser = null;

    loans = [];

    selectedLoan = null;


    destroyCharts();


    document
        .getElementById("mainApp")
        .classList.add("d-none");


    document
        .getElementById("loginPage")
        .classList.remove("d-none");

}


// =========================================================
// LOAD LOANS
// =========================================================

function loadLoans() {

    if (!currentUser) {
        return;
    }


    const allLoans =
        JSON.parse(
            localStorage.getItem(
                LOANS_KEY
            ) || "[]"
        );


    loans =
        allLoans.filter(
            loan =>
                Number(loan.userId) ===
                Number(currentUser.id)
        );


    loans.forEach(
        normalizeLoan
    );


    renderLoans();

    updateOverallDashboard();

    renderReminders();


    if (loans.length > 0) {


        if (selectedLoan) {

            const updated =
                loans.find(
                    loan =>
                        Number(loan.id) ===
                        Number(selectedLoan.id)
                );


            selectedLoan =
                updated || loans[0];

        } else {

            selectedLoan =
                loans[0];

        }


        renderSelectedLoan();

    } else {

        selectedLoan = null;

        clearSelectedLoan();

    }

}


// =========================================================
// NORMALIZE OLD DATA
// =========================================================

function normalizeLoan(loan) {

    if (!loan.payments) {

        loan.payments =
            loan.schedule || [];

    }


    if (!loan.bankName) {

        loan.bankName =
            loan.bank_name ||
            "Bank";

    }


    if (!loan.loanName) {

        loan.loanName =
            loan.loan_name ||
            "Loan";

    }


    if (!loan.loanAmount) {

        loan.loanAmount =
            Number(
                loan.loan_amount || 0
            );

    }


    if (!loan.interestRate) {

        loan.interestRate =
            Number(
                loan.interest_rate || 0
            );

    }


    if (!loan.tenureMonths) {

        loan.tenureMonths =
            Number(
                loan.tenure_months ||
                loan.payments.length
            );

    }


    if (!loan.emi) {

        loan.emi =
            Number(
                loan.payments[0]?.paymentAmount ||
                loan.paymentAmount ||
                0
            );

    }


    if (!loan.startDate) {

        loan.startDate =
            loan.start_date ||
            getTodayDate();

    }


    if (
        loan.monthlyIncome === undefined
    ) {

        loan.monthlyIncome = 0;

    }


    if (
        loan.otherDebt === undefined
    ) {

        loan.otherDebt = 0;

    }


    loan.payments.forEach(
        payment => {

            if (!payment.status) {

                payment.status =
                    payment.paid
                        ? "Paid"
                        : "Pending";

            }

        }
    );

}


// =========================================================
// SAVE LOANS
// =========================================================

function saveLoans() {

    if (!currentUser) {
        return;
    }


    const allLoans =
        JSON.parse(
            localStorage.getItem(
                LOANS_KEY
            ) || "[]"
        );


    const otherLoans =
        allLoans.filter(
            loan =>
                Number(loan.userId) !==
                Number(currentUser.id)
        );


    localStorage.setItem(
        LOANS_KEY,
        JSON.stringify(
            [
                ...otherLoans,
                ...loans
            ]
        )
    );

}


// =========================================================
// RENDER LOAN CARDS
// =========================================================

function renderLoans() {

    const container =
        document.getElementById(
            "loansContainer"
        );


    const noLoans =
        document.getElementById(
            "noLoansMessage"
        );


    container.innerHTML = "";


    if (loans.length === 0) {

        noLoans.classList.remove(
            "d-none"
        );

        return;

    }


    noLoans.classList.add(
        "d-none"
    );


    loans.forEach(
        loan => {

            const health =
                calculateLoanHealth(
                    loan
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "col-md-6 col-xl-4";


            const paid =
                getPaidAmount(loan);


            const outstanding =
                getOutstandingAmount(
                    loan
                );


            const percentage =
                getPaymentPercentage(
                    loan
                );


            card.innerHTML = `

                <div class="loan-card ${
                    selectedLoan &&
                    Number(selectedLoan.id) ===
                    Number(loan.id)
                        ? "selected"
                        : ""
                }">

                    <div class="d-flex justify-content-between align-items-start">

                        <div>

                            <div class="loan-bank">

                                <i class="bi bi-bank"></i>

                                ${escapeHtml(
                                    loan.bankName
                                )}

                            </div>


                            <div class="loan-title">

                                ${escapeHtml(
                                    loan.loanName
                                )}

                            </div>

                        </div>


                        <span class="status-badge ${
                            loan.status ===
                            "Completed"
                                ? "status-completed"
                                : "status-active"
                        }">

                            ${loan.status}

                        </span>

                    </div>


                    <div class="d-flex justify-content-between align-items-center mt-3">

                        <div class="loan-amount mb-0">

                            ${formatCurrency(
                                loan.loanAmount
                            )}

                        </div>


                        <span class="health-badge ${
                            health.level === "Healthy"
                                ? ""
                                : health.level ===
                                  "Needs Attention"
                                    ? "attention"
                                    : "risk"
                        }">

                            ${health.emoji}
                            ${health.score}

                        </span>

                    </div>


                    <div class="loan-detail">

                        <span>
                            EMI
                        </span>

                        <span>
                            ${formatCurrency(
                                loan.emi
                            )}
                        </span>

                    </div>


                    <div class="loan-detail">

                        <span>
                            Interest
                        </span>

                        <span>
                            ${Number(
                                loan.interestRate
                            ).toFixed(2)}%
                        </span>

                    </div>


                    <div class="loan-detail">

                        <span>
                            Paid
                        </span>

                        <span>
                            ${formatCurrency(
                                paid
                            )}
                        </span>

                    </div>


                    <div class="loan-detail">

                        <span>
                            Outstanding
                        </span>

                        <span>
                            ${formatCurrency(
                                outstanding
                            )}
                        </span>

                    </div>


                    <div class="mt-3">

                        <div class="d-flex justify-content-between mb-1">

                            <small>
                                Repayment Progress
                            </small>

                            <small>
                                ${percentage.toFixed(1)}%
                            </small>

                        </div>


                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="width:${percentage}%"
                            ></div>

                        </div>

                    </div>


                    <button
                        class="btn btn-outline-primary btn-sm w-100 mt-3"
                        onclick="selectLoan(${loan.id})"
                    >

                        <i class="bi bi-eye"></i>

                        View Loan

                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =========================================================
// SELECT LOAN
// =========================================================

function selectLoan(loanId) {

    const loan =
        loans.find(
            item =>
                Number(item.id) ===
                Number(loanId)
        );


    if (!loan) {
        return;
    }


    selectedLoan = loan;


    renderLoans();

    renderSelectedLoan();


    const section =
        document.getElementById(
            "selectedLoanSection"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// =========================================================
// RENDER SELECTED LOAN
// =========================================================

function renderSelectedLoan() {

    if (!selectedLoan) {

        clearSelectedLoan();

        return;

    }


    document
        .getElementById(
            "selectedLoanSection"
        )
        .classList.remove(
            "d-none"
        );


    const loan =
        selectedLoan;


    const schedule =
        getSchedule(loan);


    const paid =
        getPaidAmount(loan);


    const outstanding =
        getOutstandingAmount(
            loan
        );


    const percentage =
        getPaymentPercentage(
            loan
        );


    document
        .getElementById(
            "selectedLoanSubtitle"
        )
        .textContent =
        `${loan.bankName} • ${loan.loanName}`;


    document
        .getElementById(
            "selectedLoanAmount"
        )
        .textContent =
        formatCurrency(
            loan.loanAmount
        );


    document
        .getElementById(
            "selectedMonthlyEmi"
        )
        .textContent =
        formatCurrency(
            loan.emi
        );


    document
        .getElementById(
            "selectedOutstanding"
        )
        .textContent =
        formatCurrency(
            outstanding
        );


    document
        .getElementById(
            "interestRate"
        )
        .textContent =
        `${Number(
            loan.interestRate
        ).toFixed(2)}%`;


    document
        .getElementById(
            "loanTenure"
        )
        .textContent =
        `${loan.tenureMonths} Months`;


    const paidEmis =
        schedule.filter(
            payment =>
                payment.status ===
                "Paid"
        ).length;


    document
        .getElementById(
            "paidEmis"
        )
        .textContent =
        paidEmis;


    document
        .getElementById(
            "remainingEmis"
        )
        .textContent =
        Math.max(
            schedule.length -
            paidEmis,
            0
        );


    document
        .getElementById(
            "paymentPercentage"
        )
        .textContent =
        `${percentage.toFixed(1)}%`;


    document
        .getElementById(
            "paymentProgressBar"
        )
        .style.width =
        `${percentage}%`;


    document
        .getElementById(
            "selectedPaidAmount"
        )
        .textContent =
        formatCurrency(
            paid
        );


    document
        .getElementById(
            "selectedRemainingAmount"
        )
        .textContent =
        formatCurrency(
            outstanding
        );


    document
        .getElementById(
            "loanStartDate"
        )
        .textContent =
        formatDate(
            loan.startDate
        );


    const nextPayment =
        schedule.find(
            payment =>
                payment.status !==
                "Paid"
        );


    document
        .getElementById(
            "nextPaymentDate"
        )
        .textContent =
        nextPayment
            ? formatDate(
                nextPayment.dueDate
            )
            : "Completed";


    const finalPayment =
        schedule.length
            ? schedule[
                schedule.length - 1
            ]
            : null;


    document
        .getElementById(
            "finalPaymentDate"
        )
        .textContent =
        finalPayment
            ? formatDate(
                finalPayment.dueDate
            )
            : "-";


    document
        .getElementById(
            "scheduleLoanName"
        )
        .textContent =
        `${loan.bankName} - ${loan.loanName}`;


    document
        .getElementById(
            "resetPayments"
        )
        .disabled =
        schedule.length === 0;


    renderLoanHealth();

    renderSchedule();

    renderCharts();

}


// =========================================================
// CLEAR SELECTED
// =========================================================

function clearSelectedLoan() {

    document
        .getElementById(
            "selectedLoanSection"
        )
        .classList.add(
            "d-none"
        );


    document
        .getElementById(
            "scheduleLoanName"
        )
        .textContent =
        "Select a loan to view its schedule.";


    document
        .getElementById(
            "scheduleBody"
        )
        .innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center text-muted py-4"
                >
                    Select a loan to view repayment schedule.
                </td>

            </tr>

        `;


    document
        .getElementById(
            "resetPayments"
        )
        .disabled = true;


    destroyCharts();

}


// =========================================================
// OVERALL DASHBOARD
// =========================================================

function updateOverallDashboard() {

    const totalBorrowed =
        loans.reduce(
            (
                total,
                loan
            ) =>
                total +
                Number(
                    loan.loanAmount || 0
                ),
            0
        );


    const totalPaid =
        loans.reduce(
            (
                total,
                loan
            ) =>
                total +
                getPaidAmount(
                    loan
                ),
            0
        );


    const outstanding =
        loans.reduce(
            (
                total,
                loan
            ) =>
                total +
                getOutstandingAmount(
                    loan
                ),
            0
        );


    const interest =
        loans.reduce(
            (
                total,
                loan
            ) =>
                total +
                getTotalInterest(
                    loan
                ),
            0
        );


    const monthlyEmi =
        loans.reduce(
            (
                total,
                loan
            ) =>
                total +
                Number(
                    loan.emi || 0
                ),
            0
        );


    document
        .getElementById(
            "totalLoans"
        )
        .textContent =
        loans.length;


    document
        .getElementById(
            "originalLoan"
        )
        .textContent =
        formatCurrency(
            totalBorrowed
        );


    document
        .getElementById(
            "amountPaid"
        )
        .textContent =
        formatCurrency(
            totalPaid
        );


    document
        .getElementById(
            "amountRemaining"
        )
        .textContent =
        formatCurrency(
            outstanding
        );


    document
        .getElementById(
            "totalInterest"
        )
        .textContent =
        formatCurrency(
            interest
        );


    document
        .getElementById(
            "totalMonthlyEmi"
        )
        .textContent =
        formatCurrency(
            monthlyEmi
        );

}


// =========================================================
// ADD LOAN
// =========================================================

function handleAddLoan(event) {

    event.preventDefault();


    if (!currentUser) {
        return;
    }


    const bankName =
        document
            .getElementById(
                "newBankName"
            )
            .value
            .trim();


    const loanName =
        document
            .getElementById(
                "newLoanName"
            )
            .value
            .trim();


    const loanAmount =
        Number(
            document
                .getElementById(
                    "newLoanAmount"
                )
                .value
        );


    const interestRate =
        Number(
            document
                .getElementById(
                    "newInterestRate"
                )
                .value
        );


    const tenure =
        Number(
            document
                .getElementById(
                    "newTenure"
                )
                .value
        );


    const tenureType =
        document
            .getElementById(
                "newTenureType"
            )
            .value;


    const startDate =
        document
            .getElementById(
                "newStartDate"
            )
            .value;


    const monthlyIncome =
        Number(
            document
                .getElementById(
                    "newMonthlyIncome"
                )
                .value
        ) || 0;


    const otherDebt =
        Number(
            document
                .getElementById(
                    "newOtherDebt"
                )
                .value
        ) || 0;


    const message =
        document.getElementById(
            "loanMessage"
        );


    if (!bankName) {

        showMessage(
            message,
            "Please enter the bank/lender name.",
            "error"
        );

        return;

    }


    if (!loanName) {

        showMessage(
            message,
            "Please enter the loan name.",
            "error"
        );

        return;

    }


    if (loanAmount <= 0) {

        showMessage(
            message,
            "Loan amount must be greater than zero.",
            "error"
        );

        return;

    }


    if (interestRate < 0) {

        showMessage(
            message,
            "Interest rate cannot be negative.",
            "error"
        );

        return;

    }


    if (tenure <= 0) {

        showMessage(
            message,
            "Loan tenure must be greater than zero.",
            "error"
        );

        return;

    }


    if (!startDate) {

        showMessage(
            message,
            "Please select the loan start date.",
            "error"
        );

        return;

    }


    const tenureMonths =
        tenureType === "years"
            ? tenure * 12
            : tenure;


    const emi =
        calculateEMI(
            loanAmount,
            interestRate,
            tenureMonths
        );


    const payments =
        generateSchedule(
            loanAmount,
            interestRate,
            tenureMonths,
            emi,
            startDate
        );


    const newLoan = {

        id:
            Date.now(),

        userId:
            currentUser.id,

        bankName,

        loanName,

        loanAmount,

        interestRate,

        tenureMonths,

        emi,

        startDate,

        monthlyIncome,

        otherDebt,

        status:
            "Active",

        payments,

        createdAt:
            new Date().toISOString()

    };


    loans.push(
        newLoan
    );


    saveLoans();


    selectedLoan =
        newLoan;


    document
        .getElementById(
            "loanForm"
        )
        .reset();


    setDefaultStartDate();


    showMessage(
        message,
        "Loan added successfully!",
        "success"
    );


    loadLoans();


    const modalElement =
        document.getElementById(
            "loanModal"
        );


    if (modalElement) {

        const modal =
            bootstrap.Modal
                .getInstance(
                    modalElement
                );


        if (modal) {

            modal.hide();

        }

    }

}


// =========================================================
// EMI CALCULATION
// =========================================================

function calculateEMI(
    principal,
    annualRate,
    months
) {

    if (
        annualRate === 0
    ) {

        return (
            principal /
            months
        );

    }


    const monthlyRate =
        annualRate /
        12 /
        100;


    const factor =
        Math.pow(
            1 + monthlyRate,
            months
        );


    return (
        principal *
        monthlyRate *
        factor /
        (factor - 1)
    );

}


// =========================================================
// GENERATE SCHEDULE
// =========================================================

function generateSchedule(
    principal,
    annualRate,
    months,
    emi,
    startDate
) {

    const schedule = [];


    let balance =
        Number(principal);


    const monthlyRate =
        Number(annualRate) /
        12 /
        100;


    for (
        let i = 1;
        i <= months;
        i++
    ) {

        const interest =
            balance *
            monthlyRate;


        let principalPaid =
            emi -
            interest;


        let paymentAmount =
            emi;


        if (
            i === months
        ) {

            principalPaid =
                balance;

            paymentAmount =
                balance +
                interest;

        }


        balance =
            Math.max(
                balance -
                principalPaid,
                0
            );


        schedule.push({

            id:
                Date.now() +
                i +
                Math.floor(
                    Math.random() *
                    100000
                ),

            emiNumber:
                i,

            dueDate:
                addMonths(
                    startDate,
                    i
                ),

            paymentAmount:
                roundMoney(
                    paymentAmount
                ),

            principal:
                roundMoney(
                    principalPaid
                ),

            interest:
                roundMoney(
                    interest
                ),

            balance:
                roundMoney(
                    balance
                ),

            status:
                "Pending",

            paidDate:
                null

        });

    }


    return schedule;

}


// =========================================================
// ADD MONTHS
// =========================================================

function addMonths(
    dateValue,
    months
) {

    const date =
        new Date(
            `${dateValue}T00:00:00`
        );


    date.setMonth(
        date.getMonth() +
        months
    );


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}`
    );

}


// =========================================================
// REPAYMENT SCHEDULE
// =========================================================

function renderSchedule() {

    const tbody =
        document.getElementById(
            "scheduleBody"
        );


    tbody.innerHTML = "";


    if (!selectedLoan) {

        return;

    }


    const schedule =
        getSchedule(
            selectedLoan
        );


    schedule.forEach(
        (
            payment,
            index
        ) => {

            const isPaid =
                payment.status ===
                "Paid";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${payment.emiNumber || index + 1}
                    </strong>
                </td>


                <td>
                    ${formatDate(
                        payment.dueDate
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        payment.paymentAmount
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        payment.principal
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        payment.interest
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        payment.balance
                    )}
                </td>


                <td>

                    <span class="status-badge ${
                        isPaid
                            ? "status-paid"
                            : isPaymentOverdue(
                                payment
                              )
                                ? "status-overdue"
                                : "status-pending"
                    }">

                        ${
                            isPaid
                                ? "Paid"
                                : isPaymentOverdue(
                                    payment
                                  )
                                    ? "Overdue"
                                    : "Pending"
                        }

                    </span>

                </td>


                <td>

                    <button
                        class="btn btn-sm ${
                            isPaid
                                ? "btn-outline-warning"
                                : "btn-outline-success"
                        }"
                        onclick="changePaymentStatus(
                            ${payment.id},
                            ${isPaid}
                        )"
                    >

                        <i class="bi ${
                            isPaid
                                ? "bi-arrow-counterclockwise"
                                : "bi-check-lg"
                        }"></i>

                        ${
                            isPaid
                                ? "Undo"
                                : "Mark Paid"
                        }

                    </button>

                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );

}


// =========================================================
// CHANGE PAYMENT STATUS
// =========================================================

function changePaymentStatus(
    paymentId,
    currentlyPaid
) {

    if (!selectedLoan) {
        return;
    }


    const payment =
        selectedLoan.payments.find(
            item =>
                Number(item.id) ===
                Number(paymentId)
        );


    if (!payment) {
        return;
    }


    if (!currentlyPaid) {

        const previousPayment =
            selectedLoan.payments.find(
                item =>
                    Number(
                        item.emiNumber
                    ) ===
                    Number(
                        payment.emiNumber
                    ) - 1
            );


        if (
            previousPayment &&
            previousPayment.status !==
            "Paid"
        ) {

            alert(
                "Please mark the previous EMI as paid first."
            );

            return;

        }


        payment.status =
            "Paid";


        payment.paidDate =
            getTodayDate();


        updateLoanStatus(
            selectedLoan
        );


        saveLoans();

        loadLoans();

        showPaymentConfirmation(
            payment
        );


        return;

    }


    payment.status =
        "Pending";


    payment.paidDate =
        null;


    updateLoanStatus(
        selectedLoan
    );


    saveLoans();

    loadLoans();

}


// =========================================================
// PAYMENT CONFIRMATION
// =========================================================

function showPaymentConfirmation(
    payment
) {

    const text =
        document.getElementById(
            "paymentConfirmationText"
        );


    if (text) {

        text.textContent =
            `EMI ${payment.emiNumber} of ${
                formatCurrency(
                    payment.paymentAmount
                )
            } has been recorded as paid.`;

    }


    const modalElement =
        document.getElementById(
            "paymentConfirmationModal"
        );


    if (
        modalElement &&
        typeof bootstrap !==
        "undefined"
    ) {

        const modal =
            new bootstrap.Modal(
                modalElement
            );


        modal.show();

    }

}


// =========================================================
// RESET PAYMENTS
// =========================================================

function handleResetPayments() {

    if (!selectedLoan) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to reset all payments for this loan?"
        );


    if (!confirmed) {
        return;
    }


    selectedLoan.payments.forEach(
        payment => {

            payment.status =
                "Pending";

            payment.paidDate =
                null;

        }
    );


    selectedLoan.status =
        "Active";


    saveLoans();

    loadLoans();

}


// =========================================================
// UPDATE LOAN STATUS
// =========================================================

function updateLoanStatus(
    loan
) {

    const allPaid =
        loan.payments.length > 0 &&
        loan.payments.every(
            payment =>
                payment.status ===
                "Paid"
        );


    loan.status =
        allPaid
            ? "Completed"
            : "Active";

}


// =========================================================
// GET SCHEDULE
// =========================================================

function getSchedule(
    loan
) {

    return (
        loan?.payments || []
    );

}


// =========================================================
// GET PAID AMOUNT
// =========================================================

function getPaidAmount(
    loan
) {

    return getSchedule(
        loan
    ).reduce(
        (
            total,
            payment
        ) => {

            if (
                payment.status !==
                "Paid"
            ) {

                return total;

            }


            return (
                total +
                Number(
                    payment.paymentAmount ||
                    0
                )
            );

        },
        0
    );

}


// =========================================================
// OUTSTANDING
// =========================================================

function getOutstandingAmount(
    loan
) {

    const schedule =
        getSchedule(
            loan
        );


    if (
        schedule.length === 0
    ) {

        return Number(
            loan.loanAmount || 0
        );

    }


    const next =
        schedule.find(
            payment =>
                payment.status !==
                "Paid"
        );


    if (next) {

        return Number(
            next.balance || 0
        );

    }


    return 0;

}


// =========================================================
// TOTAL INTEREST
// =========================================================

function getTotalInterest(
    loan
) {

    return getSchedule(
        loan
    ).reduce(
        (
            total,
            payment
        ) =>
            total +
            Number(
                payment.interest || 0
            ),
        0
    );

}


// =========================================================
// PAYMENT PERCENTAGE
// =========================================================

function getPaymentPercentage(
    loan
) {

    const principal =
        Number(
            loan.loanAmount || 0
        );


    if (
        principal <= 0
    ) {

        return 0;

    }


    const paidPrincipal =
        getSchedule(
            loan
        ).reduce(
            (
                total,
                payment
            ) => {

                if (
                    payment.status !==
                    "Paid"
                ) {

                    return total;

                }


                return (
                    total +
                    Number(
                        payment.principal ||
                        0
                    )
                );

            },
            0
        );


    return Math.min(
        (
            paidPrincipal /
            principal
        ) * 100,
        100
    );

}


// =========================================================
// LOAN HEALTH
// =========================================================

function calculateLoanHealth(
    loan
) {

    const schedule =
        getSchedule(
            loan
        );


    if (
        schedule.length === 0
    ) {

        return {

            score: 50,

            level:
                "Needs Attention",

            emoji:
                "🟡"

        };

    }


    const totalEmis =
        schedule.length;


    const paidEmis =
        schedule.filter(
            payment =>
                payment.status ===
                "Paid"
        ).length;


    const overdueEmis =
        schedule.filter(
            payment =>
                payment.status !==
                    "Paid" &&
                isPaymentOverdue(
                    payment
                )
        ).length;


    const remainingBalance =
        getOutstandingAmount(
            loan
        );


    const loanAmount =
        Number(
            loan.loanAmount || 0
        );


    const remainingRatio =
        loanAmount > 0
            ? remainingBalance /
              loanAmount
            : 0;


    let score = 100;


    // ------------------------------------------
    // Payment history - 40 points
    // ------------------------------------------

    const paymentRatio =
        totalEmis > 0
            ? paidEmis /
              totalEmis
            : 0;


    const paymentHistoryScore =
        Math.round(
            paymentRatio * 40
        );


    // ------------------------------------------
    // Missed / overdue - 25 points
    // ------------------------------------------

    const overduePenalty =
        Math.min(
            overdueEmis * 8,
            25
        );


    // ------------------------------------------
    // Remaining balance - 15 points
    // ------------------------------------------

    const balanceScore =
        Math.round(
            (
                1 -
                remainingRatio
            ) * 15
        );


    // ------------------------------------------
    // Upcoming EMI - 10 points
    // ------------------------------------------

    const upcoming =
        schedule.find(
            payment =>
                payment.status !==
                "Paid"
        );


    let upcomingScore = 10;


    if (upcoming) {

        const days =
            getDaysUntil(
                upcoming.dueDate
            );


        if (
            days < 0
        ) {

            upcomingScore = 0;

        } else if (
            days <= 3
        ) {

            upcomingScore = 5;

        }

    }


    // ------------------------------------------
    // Debt-to-income - 10 points
    // ------------------------------------------

    let dtiScore = 10;


    const income =
        Number(
            loan.monthlyIncome || 0
        );


    const otherDebt =
        Number(
            loan.otherDebt || 0
        );


    if (
        income > 0
    ) {

        const totalDebt =
            Number(
                loan.emi || 0
            ) +
            otherDebt;


        const dti =
            (
                totalDebt /
                income
            ) * 100;


        if (
            dti > 60
        ) {

            dtiScore = 0;

        } else if (
            dti > 45
        ) {

            dtiScore = 4;

        } else if (
            dti > 35
        ) {

            dtiScore = 7;

        } else {

            dtiScore = 10;

        }

    }


    score =
        paymentHistoryScore +
        balanceScore +
        upcomingScore +
        dtiScore -
        overduePenalty;


    score =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(score)
            )
        );


    let level;

    let emoji;


    if (
        score >= 80
    ) {

        level =
            "Healthy";

        emoji =
            "🟢";

    } else if (
        score >= 60
    ) {

        level =
            "Needs Attention";

        emoji =
            "🟡";

    } else {

        level =
            "High Risk";

        emoji =
            "🔴";

    }


    return {

        score,

        level,

        emoji,

        paymentHistoryScore,

        overduePenalty,

        balanceScore,

        upcomingScore,

        dtiScore,

        overdueEmis

    };

}


// =========================================================
// RENDER LOAN HEALTH
// =========================================================

function renderLoanHealth() {

    if (!selectedLoan) {
        return;
    }


    const health =
        calculateLoanHealth(
            selectedLoan
        );


    const score =
        document.getElementById(
            "loanHealthScore"
        );


    const badge =
        document.getElementById(
            "loanHealthBadge"
        );


    const progress =
        document.getElementById(
            "loanHealthProgress"
        );


    const factors =
        document.getElementById(
            "healthFactors"
        );


    score.textContent =
        health.score;


    badge.textContent =
        `${health.emoji} ${health.level}`;


    badge.className =
        "health-badge";


    progress.className =
        "health-progress-bar";


    if (
        health.level ===
        "Needs Attention"
    ) {

        badge.classList.add(
            "attention"
        );

        progress.classList.add(
            "attention"
        );

    }


    if (
        health.level ===
        "High Risk"
    ) {

        badge.classList.add(
            "risk"
        );

        progress.classList.add(
            "risk"
        );

    }


    progress.style.width =
        `${health.score}%`;


    const income =
        Number(
            selectedLoan.monthlyIncome ||
            0
        );


    const dti =
        income > 0
            ? (
                (
                    Number(
                        selectedLoan.emi ||
                        0
                    ) +
                    Number(
                        selectedLoan.otherDebt ||
                        0
                    )
                ) /
                income
            ) * 100
            : null;


    factors.innerHTML = `

        <div class="health-factor">

            <span class="health-factor-name">
                Payment History
            </span>

            <span class="health-factor-value">
                ${health.paymentHistoryScore}/40
            </span>

        </div>


        <div class="health-factor">

            <span class="health-factor-name">
                Missed / Overdue
            </span>

            <span class="health-factor-value">
                ${
                    health.overdueEmis
                } overdue
            </span>

        </div>


        <div class="health-factor">

            <span class="health-factor-name">
                Balance Progress
            </span>

            <span class="health-factor-value">
                ${health.balanceScore}/15
            </span>

        </div>


        <div class="health-factor">

            <span class="health-factor-name">
                Upcoming EMI
            </span>

            <span class="health-factor-value">
                ${health.upcomingScore}/10
            </span>

        </div>


        <div class="health-factor">

            <span class="health-factor-name">
                Debt-to-Income
            </span>

            <span class="health-factor-value">

                ${
                    dti === null
                        ? "Not entered"
                        : `${dti.toFixed(1)}%`
                }

            </span>

        </div>


        <div class="health-factor">

            <span class="health-factor-name">
                Health Indicator
            </span>

            <span class="health-factor-value">
                ${health.score}/100
            </span>

        </div>

    `;

}


// =========================================================
// REMINDER SETTINGS
// =========================================================

function getReminderSettings() {

    const defaults = {

        enabled:
            true,

        daysBefore:
            3

    };


    try {

        return {

            ...defaults,

            ...JSON.parse(
                localStorage.getItem(
                    REMINDER_SETTINGS_KEY
                ) || "{}"
            )

        };

    } catch {

        return defaults;

    }

}


// =========================================================
// LOAD REMINDER SETTINGS
// =========================================================

function loadReminderSettings() {

    const settings =
        getReminderSettings();


    const enabled =
        document.getElementById(
            "reminderEnabled"
        );


    const days =
        document.getElementById(
            "reminderDays"
        );


    if (enabled) {

        enabled.checked =
            settings.enabled;

    }


    if (days) {

        days.value =
            settings.daysBefore;

    }

}


// =========================================================
// SAVE REMINDER SETTINGS
// =========================================================

function saveReminderSettingsHandler() {

    const enabled =
        document.getElementById(
            "reminderEnabled"
        ).checked;


    const daysBefore =
        Number(
            document.getElementById(
                "reminderDays"
            ).value
        );


    localStorage.setItem(
        REMINDER_SETTINGS_KEY,
        JSON.stringify({

            enabled,

            daysBefore

        })
    );


    renderReminders();

}


// =========================================================
// RENDER REMINDERS
// =========================================================

function renderReminders() {

    const container =
        document.getElementById(
            "reminderContainer"
        );


    const empty =
        document.getElementById(
            "noReminderMessage"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const settings =
        getReminderSettings();


    if (!settings.enabled) {

        empty.classList.remove(
            "d-none"
        );


        empty.querySelector(
            "h5"
        ).textContent =
            "Reminders are disabled";


        empty.querySelector(
            "p"
        ).textContent =
            "Enable in-app reminders from Reminder Settings.";


        return;

    }


    const reminders = [];


    loans.forEach(
        loan => {

            const payment =
                getSchedule(
                    loan
                ).find(
                    item =>
                        item.status !==
                        "Paid"
                );


            if (!payment) {
                return;
            }


            const days =
                getDaysUntil(
                    payment.dueDate
                );


            if (
                days < 0
            ) {

                reminders.push({

                    loan,

                    payment,

                    days,

                    type:
                        "overdue"

                });


            } else if (
                days <=
                settings.daysBefore
            ) {

                reminders.push({

                    loan,

                    payment,

                    days,

                    type:
                        days <= 1
                            ? "warning"
                            : "normal"

                });

            }

        }
    );


    if (
        reminders.length === 0
    ) {

        empty.classList.remove(
            "d-none"
        );


        empty.querySelector(
            "h5"
        ).textContent =
            "No urgent reminders";


        empty.querySelector(
            "p"
        ).textContent =
            "You're all caught up with your EMI payments.";


        return;

    }


    empty.classList.add(
        "d-none"
    );


    reminders.sort(
        (
            a,
            b
        ) =>
            a.days -
            b.days
    );


    reminders.forEach(
        reminder => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                `reminder-card ${
                    reminder.type
                }`;


            let title;


            if (
                reminder.days < 0
            ) {

                const overdueDays =
                    Math.abs(
                        reminder.days
                    );


                title =
                    `Your ${
                        formatCurrency(
                            reminder.payment.paymentAmount
                        )
                    } EMI is overdue by ${
                        overdueDays
                    } day${
                        overdueDays === 1
                            ? ""
                            : "s"
                    }.`;

            } else if (
                reminder.days === 0
            ) {

                title =
                    `Your ${
                        formatCurrency(
                            reminder.payment.paymentAmount
                        )
                    } EMI is due today.`;

            } else {

                title =
                    `Your ${
                        formatCurrency(
                            reminder.payment.paymentAmount
                        )
                    } EMI is due in ${
                        reminder.days
                    } day${
                        reminder.days === 1
                            ? ""
                            : "s"
                    }.`;

            }


            card.innerHTML = `

                <div class="reminder-main">

                    <div class="reminder-icon">

                        <i class="bi ${
                            reminder.days < 0
                                ? "bi-exclamation-triangle"
                                : "bi-bell"
                        }"></i>

                    </div>


                    <div>

                        <div class="reminder-title">

                            ${escapeHtml(
                                title
                            )}

                        </div>


                        <div class="reminder-subtitle">

                            ${escapeHtml(
                                reminder.loan.bankName
                            )}
                            -
                            ${escapeHtml(
                                reminder.loan.loanName
                            )}

                            • EMI ${
                                reminder.payment.emiNumber
                            }

                            • Due ${
                                formatDate(
                                    reminder.payment.dueDate
                                )
                            }

                        </div>

                    </div>

                </div>


                <button
                    class="btn btn-sm btn-outline-primary"
                    onclick="selectLoan(
                        ${reminder.loan.id}
                    )"
                >

                    View Loan

                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =========================================================
// CHECK OVERDUE
// =========================================================

function isPaymentOverdue(
    payment
) {

    if (
        payment.status ===
        "Paid"
    ) {

        return false;

    }


    return (
        getDaysUntil(
            payment.dueDate
        ) < 0
    );

}


// =========================================================
// DAYS UNTIL
// =========================================================

function getDaysUntil(
    dateValue
) {

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const target =
        new Date(
            `${dateValue}T00:00:00`
        );


    target.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        target.getTime() -
        today.getTime();


    return Math.ceil(
        difference /
        (
            1000 *
            60 *
            60 *
            24
        )
    );

}


// =========================================================
// CHARTS
// =========================================================

function renderCharts() {

    if (!selectedLoan) {
        return;
    }


    destroyCharts();


    const paid =
        getPaidAmount(
            selectedLoan
        );


    const outstanding =
        getOutstandingAmount(
            selectedLoan
        );


    const schedule =
        getSchedule(
            selectedLoan
        );


    const balances =
        schedule.map(
            payment =>
                Number(
                    payment.balance || 0
                )
        );


    const labels =
        schedule.map(
            payment =>
                `EMI ${
                    payment.emiNumber
                }`
        );


    const loanCanvas =
        document.getElementById(
            "loanChart"
        );


    const balanceCanvas =
        document.getElementById(
            "balanceChart"
        );


    if (
        loanCanvas &&
        typeof Chart !==
        "undefined"
    ) {

        loanChart =
            new Chart(
                loanCanvas,
                {

                    type:
                        "doughnut",

                    data: {

                        labels: [
                            "Paid",
                            "Outstanding"
                        ],

                        datasets: [

                            {

                                data: [
                                    paid,
                                    outstanding
                                ]

                            }

                        ]

                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,

                        plugins: {

                            legend: {

                                position:
                                    "bottom"

                            }

                        }

                    }

                }
            );

    }


    if (
        balanceCanvas &&
        typeof Chart !==
        "undefined"
    ) {

        balanceChart =
            new Chart(
                balanceCanvas,
                {

                    type:
                        "line",

                    data: {

                        labels,

                        datasets: [

                            {

                                label:
                                    "Outstanding Balance",

                                data:
                                    balances,

                                tension:
                                    0.3,

                                fill:
                                    false
                                    }

                        ]

                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,

                        scales: {

                            y: {

                                beginAtZero:
                                    true

                            }

                        }

                    }

                }
            );

    }

}


// =========================================================
// DESTROY CHARTS
// =========================================================

function destroyCharts() {

    if (loanChart) {

        loanChart.destroy();

        loanChart = null;

    }


    if (balanceChart) {

        balanceChart.destroy();

        balanceChart = null;

    }

}


// =========================================================
// DEFAULT DATE
// =========================================================

function setDefaultStartDate() {

    const input =
        document.getElementById(
            "newStartDate"
        );


    if (
        input &&
        !input.value
    ) {

        input.value =
            getTodayDate();

    }

}


// =========================================================
// TODAY
// =========================================================

function getTodayDate() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}`
    );

}


// =========================================================
// FORMAT CURRENCY
// =========================================================

function formatCurrency(
    amount
) {

    return new Intl.NumberFormat(
        "en-IN",
        {

            style:
                "currency",

            currency:
                "INR",

            maximumFractionDigits:
                2

        }
    ).format(
        Number(amount) || 0
    );

}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(
    dateValue
) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(
            `${dateValue}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleDateString(
        "en-IN",
        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        }
    );

}


// =========================================================
// ROUND MONEY
// =========================================================

function roundMoney(
    value
) {

    return Math.round(
        (
            Number(value) +
            Number.EPSILON
        ) * 100
    ) / 100;

}


// =========================================================
// MESSAGE
// =========================================================

function showMessage(
    element,
    text,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        text;


    element.className =
        `message ${type}`;

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(
    value
) {

    return String(
        value
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// =========================================================
// GLOBAL FUNCTIONS
// =========================================================

window.selectLoan =
    selectLoan;


window.changePaymentStatus =
    changePaymentStatus;