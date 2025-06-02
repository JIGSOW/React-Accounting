import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbacklng: "en",
    resources: {
      en: {
        translation: {
          //--- Global Vars---//
          back: "Back",
          //--- Global User Vars---//
          password: "Password",
          signUp: "Sign Up",
          userName: "User Name",
          email: "Email",
          confirmPassword: "Confirm Password",
          logout: "Logout",
          //---Login---//
          login: "Login",
          emailOrUserName: "Email or User Name",
          forgotPassword: "Forgot Password",
          //---Register---//
          resetcode: "Your Reset Code is",
          dontLoseIt: "Dont Lose It",
          //---Reset Password---//
          resetPassword: "Reset Password",
          resetPasswordCode: "Reset Code",
          newPassword: "New Password",
          reset: "Reset",

          //---Global Accounting Vars---//
          sellSupplies: "Sell Supplies",
          sell: "Sell",

          customers: "Customers",
          customer: "Customer",
          addCustomer: "Add Customer",
          totalDebt: "Total Debt",

          sellCustomer: "Sell Customer",
          debt: "Debt",
          paid: "paid",
          sellCustomerbtn: "Sell Customer",

          moneyIncome: "Money Income",
          addIncome: "Add Income",

          payment: "Payment",
          reason: "Reason",
          pay: "Pay",

          types: "Types",
          addType: "Add Type",

          supplies: "Supplies",
          unit: "Unit",
          kg: "Kgram",
          gram: "gram",
          peace: "Piece",
          addSupply: "Add Supply",

          dispatchSupplies: "Dispatch Supplies",
          dispatch: "Dispatch",

          buySupplies: "Buy Supplies",
          buy: "Buy",

          employees: "Employees",
          employeeName: "Employee Name",
          salary: "Salary",
          employ: "Employ",

          buyPrice: "Buy Price",
          sellPrice: "Sell Price",

          addedSuccessfully: "added Successfully",
          type: "Type",
          supply: "Supply",
          countity: "Countity",
          price: "Price",
          total: "Total",
          date: "Date",
          notes: "Notes",
          actions: "Actions",
          search: "Search",
          refresh: "Refresh",
          edit: "Edit",
          save: "Save",
          delete: "Delete",

          generate: "Generate",
          startDate: "Start Date",
          endDate: "End Date",
          inventory: "Inventory",
          show: "Show",

          initialCountity: "Initial Countity",
          finalCountity: "Final Countity",
          initialFund: "Initial Fund",
          finalFund: "Final Fund",
          salesCountity: "Sales Countity",
          purchaseCountity: "Purchases Countity",
          debtCountity: "Debt Countity",
          unPaidCustomers: "Unpaid Customers",
          discrepancy: "Discrepancy",
          dispatchedSupply: "Dispatched Supply",
          dispatchedValue: "Dispatched Value",
          inventoryDate: "Inventory Date",

          profits: "Profits",

          sells_value:"Sales Value",
          purchase_value: "Purchases Value",
          
          close: "Close",

          setupAccount: "SetUp Your Account",
          enterBudget: "Enter Budget (Required)",
          insertTypes: "Insert Types (Optional)",
          insertExistingCustomer: "Insert Existing Customer Names (Optional)",
          insertExistingEmployees: "Insert Existing Employees (Optional)",
          setupError: "Please Enter Budget",

          submit: "Submit",

          sellsFund: "Sells Fund",
          moveToPerma: "Move to Perma Fund",
          permaFund: "Permanant Fund",

          reset: "Reset",
          calculate: "Calculate",


          passwordmatcherror: "Password Does Not Match",

          passwordRegixError: `Password Must be at least 8 characters long, at least one uppercase letter
                                    at least one lowercase letter, at least one digit and  least one special character.`,

          options: "Options",

          downloadData: "Download Data",

          excel: "Excel",
          pdf: "PDF",

          excelerror1: "Please select a file first",
          uploading: "Uploading...",
          importedDataSuccess: "Sheets Are Imported Successfully",
          uploadFailed: "Upload failed",
          chooseExcelFile: "Choose Excel File",
          uploadData: "Upload Data",

          showdata: "Show Data",

          Doc: "Documentation",

          openDoc: "Open Documentation",

          DocumentationTitle: "Important Please Read",

          Doc1: "There are Some Important Rules you Have To Follow To Avoid Erros:",
          Doc2: "1- You Can't Add or Buy Any Supply If You Don't Have a (Type)",
          Doc3: "2- You Can't Dispatch A supply If You Don't Have a (Supply)",
          Doc4: "3- You Can't Sell Customer Or Add a Money Income If You Don't Have a (Customer)",
          Doc5: "4- You Can't Generate Inventory Records If You Don't Have a (Supply)",
          Doc6: "5- Avoid Adding Dump Records If You Don't Need Them for Less Discrepancy",
          Doc7: "6- If You Buy a Non Existed Supply It Will be Created But You Have to Edit Some Default Data By your Self",
          Doc8: "7- Downloaded Data Doesn't Include Your Account Information and Supply Information",
          Doc9: "8- When You Upload an Excel File Make Sure to edit the Dates Manually and Dispatch Supplies needs to be added Manually Too",
          Doc10:
            "Don't Ever Lose Your Reset Code Or You will Lose Your Account",
          Doc11:
            ". Make sure that edited data are correct not all data are automatically applied",
          Doc12:"These Steps Help Improve the Integrity and Consistancy of Your Data Where If you Try To add something without applying these conditions the Program will throw an Error",

          supplies_warn: "Supplies Can not be added if Types Section is Empty",
          dispatch_warn:
            "Supplies Can not be dispatched if Supplies Section is Empty",
          buySupplies_Warn:
            "Supplies Can not be bought if Types and Supplies Sections are Empty ",
          inventory_warn:
            "Inventory Can not be generated if Supplies Section is Empty",

          sellCustomer_Warn:
            "Sell Customer Can not be completed if Supplies and Customer Sections are Empty",
          moneyIncome_warn:
            "Money Income Con not be added if Sell Customers and Customers are Empty",
          main_warn: "Supplies Can not be sold if Supplies Section is Empty",
        },
      },
      ar: {
        translation: {
          //--- Global Vars---//
          back: "العودة",
          //--- Global User Vars---//
          password: "كلمة المرور",
          signUp: "انشاء حساب",
          userName: "اسم المستخدم",
          email: "البريد",
          confirmPassword: "تاكيد كلمة المرور",
          logout: "تسجيل خروج",
          //---Login---//
          login: "تسجيل الدخول",
          emailOrUserName: "البريد او اسم المستخدم",
          forgotPassword: "نسيت كلمة المرور",
          //---Register---//
          resetcode: "رمز اعادة التفعيل",
          dontLoseIt: "لا تخسره",
          //---Reset Passowrd---//
          resetPassword: "تغيير كلمة المرور",
          resetPasswordCode: "رمز التغيير",
          newPassword: "كلمة المرور الجديدة",
          reset: "تغيير",

          //---Global Accounting Vars---//
          sellSupplies: "بيع سلعة",
          addedSuccessfully: "اضيف بنجاح",

          customers: "الزبائن",
          customer: "الزبون",
          addCustomer: "اضافة زبون",
          totalDebt: "اجمالي الديون",

          sellCustomer: "بيع زبون",
          debt: "دين",
          paid: "تم دفع",
          sellCustomerbtn: "بيع زبون",

          moneyIncome: "المقبوضات",
          addIncome: "أضافة مقبوض",

          payment: "المدفوعات",
          reason: "السبب",
          pay: "ادفع",

          types: "الاصناف",
          addType: "اضافة صنف",

          supplies: "البضائع",
          Unit: "الوحدة",
          Kgram: "كيلو",
          Gram: "غرام",
          Piece: "قطعة",
          addSupply: "اضافة",

          dispatchSupplies: "اخراج بضاعة",
          dispatch: "اخراج",

          buySupplies: "شراء بضاعة",
          buy: "شراء",

          employees: "الموظفين",
          employeeName: "اسم الموظف",
          salary: "الراتب",
          employ: "توظيف",

          buyPrice: "سعر الشراء",
          sellPrice: "سعر البيع",

          sell: "تاكيد",
          type: "الصنف",
          supply: "السلعة",
          countity: "الكمية",
          price: "السعر",
          total: "الاجمالي",
          date: "التاريخ",
          notes: "ملاحظات",
          actions: "وظائف",
          search: "بحث",
          refresh: "تحديث",
          edit: "تعديل",
          save: "حفظ",
          delete: "حذف",

          generate: "توليد",
          startDate: "تاريخ البدء",
          endDate: "التاريخ النهائي",
          inventory: "الجرد",
          show: "اظهار",

          initialCountity: "الكمية الاولية",
          finalCountity: "الكمية النهائية",
          initialFund: "الصندوق الاولي",
          finalFund: "الصندوق النهائي",
          salesCountity: "كمية المبيعات",
          purchaseCountity: "كمية المشتريات",
          debtCountity: "الكمية المدينة",
          unPaidCustomers: "الزبائن المدينين",
          discrepancy: "النقص",
          dispatchedSupply: "البضاعة المخرجة",
          dispatchedValue: "قيمة الاخراج",
          inventoryDate: "تاريخ الجرد",

          profits: "الارباح",

          sells_value:"قيمة المبيعات",
          purchase_value: "قيمة المشتريات",

          close: "اغلاق",

          setupAccount: "جهز حسابك",
          enterBudget: "ادخل راس المال (مطلوب)",
          insertTypes: "ادخل الاصناف (اختياري)",
          insertExistingCustomer: "ادخل الزبائن الموجودين (اختياري)",
          insertExistingEmployees: "ادخل الموظفين الموجودين (اختياري)",
          setupError: "الرجاء ادخال راس المال",

          submit: "تاكيد",

          sellsFund: "صندوق المبيعات",
          moveToPerma: "نقل الى صندوق الدائم",
          permaFund: "الصندوق الدائم",

          reset: "مسح الكل",
          calculate: "حساب",

          passwordmatcherror: "حقلا كلمة المرور غير متطابقان",

          passwordRegixError: `كلمة المرور يجب أن تكون مكونة من 8 أحرف على الأقل، تحتوي على حرف كبير واحد على الأقل، وحرف صغير واحد على الأقل، ورقم واحد على الأقل، و رمز واحد على الأقل`,

          options: "اعدادات",

          downloadData: "تحميل البيانات",

          excel: "ملف اكسل",
          pdf: "ملف PDF",

          excelerror1: "الرجاء اختيار الملف اولا",
          uploading: "يتم التحميل...",
          importedDataSuccess: "تم استيراد الملف بنجاح",
          uploadFailed: "فشل الاستيراد",
          chooseExcelFile: "اختار ملف اكسل",
          uploadData: "رفع البيانات",

          showdata: "اظهار البيانات",

          Doc: "وثائق تعليمية",
          openDoc: "فتح الوثائق",

          DocumentationTitle: "هام يرجى القراءة",

          Doc1: "يوجد بعض القوانين التي يجب اتباعها لتجنب الوقوع في الاخطاء:",
          Doc2: "1- لا يمكنك اضافة او شراء اي بضاعة اذا لم يكن لديك (اصناف)",
          Doc3: "2- لا يمكنك اخراج بضاعة اذا لم يكن لديك (بضاعة)",
          Doc4: "3- لا يمكنك بيع زبون او اضافة تقارير المقبوضات اذا لم يكن لديك (زبون)",
          Doc5: "4- لا يمكنك توليد تقارير الجرد اذا لم يكن لديك (بضاعة)",
          Doc6: "5- تجنب اضافة بيانات وهمية او خاطئة للتقليل من النقص في التقراير",
          Doc7: "6- اذا اشتريت بضاعة ليست موجودة سابقا سيتم انشاء البضاعة تلقائيا ولكن يجب تعديل بعض البيانات التي تتولد تلقائيا",
          Doc8: "7- البيانات المحملة لا تحمل معلومات حول حسابك و بيانات البضاعة",
          Doc9: "8- عندما ترفع ملف اكسل تاكد من تعديل التواريخ يدويا و اضافة البضاعة المخرجة يدويا",
          Doc10:
            "اياك ابدا ان تخسر رمز اعادة تغيير كلمة المرور و الا سيتم خسارة حسابك",
          Doc11:
            ". تاكد من البيانات عند التعديل لان ليس جميعها يتم تعيينه بشكل تلقائي",
          Doc12: ". هذه الخطوات تساعد في الحفاظ على اتساق و تناسق لبياناتك بحيث اذا اضفت شيئا بدون تطبيق الشروط السابقة سيتم اظهار رسالة خطا",

          supplies_warn: "لا يمكن اضافة بضاعة اذا كان قسم الاصناف فارغ",
          dispatch_warn: "لا يمكن اخراج بضاعة اذا كان قسم البضاعة فارغ",
          buySupplies_Warn:
            "لا يمكن شراء بضاعة اذا كان كلا من قسم الاصناف و البضاعة فارغين",
          inventory_warn: "لا يمكن توليد الجرد اذا كان قسم البضاعة فارغ",
          sellCustomer_Warn:
            "لا يمكن بيع الزبائن اذا كان كلا من قسم البضاعة و الزبون فارغين",
          moneyIncome_warn:
            "لا يمكن اضافة مقبوضات اذا كان قسم بيع الزبون و الزبون فارغين",
          main_warn: "لا يمكن بيع بضاعة اذا كان قسم البضاعة فارغ",
        },
      },
    },
  });
