require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const cors = require('cors');
const connectDB = require("./db/conn");
const PORT = process.env.PORT || 5004;
const errorHandler = require ('./middleware/userMiddleware/errorhandler')
const userRoutes = require('./routes/userRoutes/userRoutes');

const contactUs = require('./routes/userRoutes/contactRoutes');
const ecom = require('./routes/eCommerceRoutes/ecomUserRoutes');
const gst  = require('./routes/gstRoutes/gstRoutes');
const org = require('./routes/masterRoutes/orgRoutes')
const crm = require('./routes/crmRoutes/crmUserRoutes');
const payroll =require('./routes/payrollRoutes/payrollRoutes');
const osInternalRoutes = require("./routes/internalRoutes/osInternalRoutes");
const accountgrpRoutes = require('./routes/financeRotues/accountGroupRoutes');
const accountRoutes = require('./routes/financeRotues/accountRoutes')
const transactionRoutes = require('./routes/transactionRoutes/transactionRoutes')
const item = require('./routes/financeRotues/itemRoutes')
const itemGroup = require('./routes/financeRotues/itemGroupRoutes');
const voucherConfig = require('./routes/configRoutes/voucherConfigRoutes')






app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  }));
app.use(express.json());
app.use(errorHandler);



app.use('/api/users', userRoutes);
app.use('/api/contact',contactUs);
app.use('/api/ecom',ecom);
app.use('/api/gst',gst);
app.use('/api/org',org)
app.use("/api/OS", osInternalRoutes);
app.use("/api/crm", crm);
app.use("/api/payroll",payroll);
app.use('/api/account-group', accountgrpRoutes); 
app.use('/api/account',accountRoutes)
app.use('/api/item',item);
app.use('/api/item-group',itemGroup)
app.use('/api/voucher',voucherConfig)




connectDB().then(()=>{
    app.listen(PORT,()=>{
        
        console.log("Server is running "+PORT);
    })
})
