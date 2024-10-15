const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ContactSchema = require("../../model/userModel/ContactUs");
const osInternal = require("../../model/internalModel/osInternal");
const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
async function authenticateUser(req) {
  const token = req.cookies.token;

  if (!token) throw new Error("No token provided");


  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) throw new Error("Unauthorized");

  const user = await osInternal.findById(decoded.id);
  if (!user) throw new Error("User not found");

  return user; // Returns the authenticated user
}

// Handle create contact us
async function handleSendContact(req, res) {
  try {
    const {
      name,
      email,
      phoneNo,
      description,
      ecom,
      crm,
      payroll,
      userSize,
      account,
      businessName,
    } = req.body;
    if (!name || !email || !phoneNo) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const newContact = new ContactSchema({
      name,
      email,
      phoneNo,
      description,
      ecom,
      crm,
      payroll,
      userSize,
      account,
      businessName,
    });
    await newContact.save();

    res.status(201).json({
      message: "Contact us form submitted successfully",
      userContact: newContact,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function getAllUserContacts(req, res) {
  try {
    const user = await authenticateUser(req);

    // Check user authorization
    if (user.role !== "Admin" && user.department !== "sales") {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this resource" });
    }

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    // Fetch contacts with pagination

    const contacts = await ContactSchema.find({ assign: null, isDelete: false,  })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: Sort by created date, most recent first

    // Count total contacts for pagination info
    const totalContacts = await ContactSchema.countDocuments({
      assign: null,
      isDelete: false,
    });

    // If no contacts found, return a 204 status
    if (!contacts.length) {
      return res.status(204).json({ message: "No contact us form submitted" });
    }

    // Return paginated results with total count
    res.status(200).json({
      message: "User contact us form data",
      contacts,
      totalContacts,
      totalPages: Math.ceil(totalContacts / limit),
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Soft delete a user by ID
async function softDeleteUser(req, res) {
  const userId = req.params.id;

  try {
    await authenticateUser(req);

    if (!userId) return res.status(400).json({ message: "Id is not provided" });

    const updatedUser = await ContactSchema.findByIdAndUpdate(
      userId,
      { isDelete: true },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User soft deleted successfully",
      updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Approve a user by ID
async function approveUserById(req, res) {
  const userId = req.params.id;

  try {
    await authenticateUser(req);

    const updatedUser = await ContactSchema.findByIdAndUpdate(
      userId,
      { isAprove: true },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User approved successfully",
      updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Assign a contact to a user
async function assignContact(req, res) {
  const contactId = req.params.id;
  const { assignId } = req.body;

  try {
    await authenticateUser(req);

    const updatedContact = await ContactSchema.findByIdAndUpdate(
      contactId,
      { assign: assignId },
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({
      message: "Contact assigned successfully",
      updatedContact,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Get assigned work for the logged-in user
async function getAssignedWork(req, res) {
  try {
    const user = await authenticateUser(req);

    const assignedContacts = await ContactSchema.find({
      assign: user._id,
      isDelete: false,

      status: { $ne: 'approved' }
    });
    if (!assignedContacts.length) {
      return res.status(200).json({ message: "No assigned work found" });
    } 


    res.status(200).json({
      message: "Assigned work retrieved successfully",
      assignedWork: assignedContacts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Handle contact "no response" marking and automatic follow-up with the same status
async function handleNoResponseAndFollowUp(req, res) {
    const contactId = req.params.id;
    const { reason } = req.body;

    try {
        const user = await authenticateUser(req);

        // Fetch contact by ID
        const contact = await ContactSchema.findById(contactId);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        // Check user authorization for marking as "no response"
        if (user.role !== 'Admin' && contact.assign.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to mark this entry as no response or perform follow-up' });
        }

        // Get the current date and the last contacted date
        const currentDate = new Date();
        const lastContactedDate = new Date(contact.lastContactedAt);

        // Check if the contact is already marked as "no response"
        if (contact.status === 'no response') {
            // Check if 12 hours have passed since the last follow-up attempt
            if ((currentDate - lastContactedDate) >= 12 * 60 * 60 * 1000) {
                // If 12 hours have passed, we update the last contacted time and allow another follow-up attempt
                contact.followUpAttempts += 1;
                contact.lastContactedAt = currentDate;
                contact.notes.push({
                    message: reason || 'Follow-up after no response',
                    date: currentDate
                });

                await contact.save();

                return res.status(200).json({
                    message: 'Follow-up performed successfully after 12 hours',
                    contact
                });
            } else {
                // If 12 hours have not passed, return an error message
                return res.status(400).json({ message: 'Follow-up attempt can only be made after 12 hours' });
            }
        } else {
            // If the contact status is not "no response", mark it as "no response"
            contact.status = 'no response';
            contact.followUpAttempts += 1;
            contact.lastContactedAt = currentDate;
            contact.notes.push({
                message: reason || 'Marked as no response',
                date: currentDate
            });

            await contact.save();

            return res.status(200).json({
                message: 'Contact marked as "No Response"',
                contact
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


// Mark a contact as "done"
async function markContactAsDone(req, res) {
  const contactId = req.params.id;

  try {
    const user = await authenticateUser(req);

    const contact = await ContactSchema.findById(contactId);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    // Check if the contact is already marked as done
    if (contact.status === "approved") {
      return res
        .status(400)
        .json({ message: "Contact is already marked as done" });

    }

    contact.status = "approved";
    await contact.save();

    res.status(200).json({
      message: "Contact marked as done successfully",
      updatedContact: contact,
    });

    }
     catch(error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
// Handle contact "no response" marking and automatic follow-up with the same status
async function handleNoResponseAndFollowUp(req, res) {
  const contactId = req.params.id;
  const { reason } = req.body;

  try {
    const user = await authenticateUser(req);

    // Fetch contact by ID
    const contact = await ContactSchema.findById(contactId);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    // Check user authorization for marking as "no response"
    if (
      user.role !== "Admin" &&
      contact.assign.toString() !== user._id.toString()
    ) {
      return res
        .status(403)
        .json({
          message:
            "You are not authorized to mark this entry as no response or perform follow-up",
        });
    }

    // Get the current date and the last contacted date
    const currentDate = new Date();
    const lastContactedDate = new Date(contact.lastContactedAt);

    // Check if the contact is already marked as "no response"
    if (contact.status === "no response") {
      // Check if 12 hours have passed since the last follow-up attempt
      if (currentDate - lastContactedDate >= 12 * 60 * 60 * 1000) {
        // If 12 hours have passed, we update the last contacted time and allow another follow-up attempt
        contact.followUpAttempts += 1;
        contact.lastContactedAt = currentDate;
        contact.notes.push({
          message: reason || "Follow-up after no response",
          date: currentDate,
        });

        await contact.save();

        return res.status(200).json({
          message: "Follow-up performed successfully after 12 hours",
          contact,
        });
      } else {
        // If 12 hours have not passed, return an error message
        return res
          .status(400)
          .json({
            message: "Follow-up attempt can only be made after 12 hours",
          });
      }
    } else {
      // If the contact status is not "no response", mark it as "no response"
      contact.status = "no response";
      contact.followUpAttempts += 1;
      contact.lastContactedAt = currentDate;
      contact.notes.push({
        message: reason || "Marked as no response",
        date: currentDate,
      });

      await contact.save();

      return res.status(200).json({
        message: 'Contact marked as "No Response"',
        contact,
      });
    }

  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
async function rejectUserById(req, res) {
  const userId = req.params.id;
  const { rejectionReason } = req.body;

  try {
    await authenticateUser(req);

    const updatedUser = await ContactSchema.findByIdAndUpdate(
      userId,
      { isRejected: true, rejectionReason, status: "rejected" },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User rejected successfully",
      updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }

}

// Fetch all successful leads (leads marked as done/approved)
async function getSuccessfulLeads(req, res) {
  try {
    const user = await authenticateUser(req);

    // Ensure only Admin or Sales department can access this resource
    if (user.role !== "SuperAdmin" && user.department !== "sales") {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this resource" });
    }

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    // Fetch all leads that are marked as approved (successful leads)
    const successfulLeads = await ContactSchema.find({
      status: "approved",
      isDelete: false,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by creation date, most recent first

    // Count total successful leads for pagination info
    const totalLeads = await ContactSchema.countDocuments({
      status: "approved",
      isDelete: false,
    });

    // If no leads found, return a 204 status
    if (!successfulLeads.length) {
      return res.status(204).json({ message: "No successful leads found" });
    }

    // Return successful leads with pagination info
    res.status(200).json({
      message: "Successful leads retrieved successfully",
      leads: successfulLeads,
      totalLeads,
      totalPages: Math.ceil(totalLeads / limit),
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}



async function getSuccessfulLeadsByOnboarding(req,res){
  try {
    const user = await authenticateUser(req);

    // Ensure only Admin or Sales department can access this resource
    if (user.role !== "Admin" && user.department !== 'OnBoard') {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this resource" });
    }

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    // Fetch all leads that are marked as approved (successful leads)
    const successfulLeads = await ContactSchema.find({
      status: "approved",
      isDelete: false,
      isAprove: false
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by creation date, most recent first

    // Count total successful leads for pagination info
    const totalLeads = await ContactSchema.countDocuments({
      status: "approved",
      isDelete: false,
    });

    // If no leads found, return a 204 status
    if (!successfulLeads.length) {
      return res.status(204).json({ message: "No successful leads found" });
    }

    // Return successful leads with pagination info
    res.status(200).json({
      message: "Successful leads retrieved successfully",
      leads: successfulLeads,
      totalLeads,
      totalPages: Math.ceil(totalLeads / limit),
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }

}

async function getContactUsById(req, res){
  try {
    const  contactId = req.params.id;
    const  contact = await ContactSchema.findById(contactId);
    const user = await authenticateUser(req);
    if(user.department !== 'OnBoard'){
      return res.status(400).json({
        message: "You are not authorized to access this resource",
      })
    }
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({
      message :  "Contact retrieved successfully",
      contact
    } );
 
 
  }
  catch(error){
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    })
  }
}

module.exports = {
  handleSendContact,
  getAllUserContacts,
  softDeleteUser,
  approveUserById,
  assignContact,
  getAssignedWork,
  handleNoResponseAndFollowUp,
  markContactAsDone,
  rejectUserById,
  getSuccessfulLeads,
  getSuccessfulLeadsByOnboarding,
  getContactUsById
};
