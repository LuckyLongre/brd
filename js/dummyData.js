/**
 * dummyData.js
 * Test user data with pre-generated step outputs
 * Contains 5 users with conversations from WhatsApp, Slack, Gmail, and Meetings
 */

const DummyData = {
  // All 5 test users with their raw conversation data
  users: [
    // USER 1: Alex Chen - E-Commerce Checkout Flow
    {
      user_id: "test1",
      name: "Alex Chen",
      role: "CEO",
      project: "E-Commerce Checkout Flow",
      data_vault: {
        proposal: {
          vendor: "CyberSafe Security Solutions",
          authorized_by: "Sarah Jenkins (Lead Auditor)",
          project: "PCI-DSS Compliance & Penetration Test",
          scope: [
            "Comprehensive penetration testing of checkout-related microservices.",
            "PCI-DSS Level 2 compliance readiness assessment.",
            "Formal vulnerability remediation report.",
            "Risk documentation aligned with insurance policy requirements."
          ],
          cost: "$15,000 USD",
          timeline: "14 business days from project kickoff",
          mandatory_compliance: "External audit is required for maintaining 'Pro Tier' payment processing license. Internal scans alone insufficient. Skipping audit increases license, insurance, and legal risks."
        },
        meetings: [
          {
            meeting_id: "mtg_tech_review_2024-02-05",
            title: "Technical Architecture Review (Stakeholders Sync)",
            date: "Feb 05, 2024",
            participants: ["Alex Chen (CEO)", "Rajesh Patel (CTO)", "Maria Santos (CFO)"],
            minutes: [
              {
                timestamp: "00:05:12",
                speaker: "Rajesh (CTO)",
                text: "Uh, okay, so I've shared the CyberSafe proposal. It's $15,000, um… and, yeah, we really need to sign this by Friday to stay on track for the March 31 launch."
              },
              {
                timestamp: "00:06:10",
                speaker: "Alex (CEO)",
                text: "Hmm, $15k… Can we maybe shuffle something around in the budget? What's the risk if we delay?"
              },
              {
                timestamp: "00:06:45",
                speaker: "Maria (CFO)",
                text: "Rajesh, I'm looking at the ledger again. We only have $55k total for the whole project. Uh… if we spend $15k on this audit, we might not afford the Stripe senior integration developers."
              },
              {
                timestamp: "00:07:30",
                speaker: "Alex (CEO)",
                text: "Could we push the audit to Q2 then? Just thinking aloud…"
              },
              {
                timestamp: "00:07:45",
                speaker: "Rajesh (CTO)",
                text: "Well, it's a risk, Alex. If we have a breach, the internal scan alone, uh… won't protect us legally, at least not fully."
              },
              {
                timestamp: "00:08:10",
                speaker: "Alex (CEO)",
                text: "I get that, I do. But, the March 31 launch date is non-negotiable for the investors. So, um… I think we may need to skip the external audit for now, and use the $15k to speed up development."
              },
              {
                timestamp: "00:08:30",
                speaker: "Maria (CFO)",
                text: "Alright… I mean, if you insist, budget is locked at $55k with no audit fee. Just, uh… make sure we note everything carefully."
              },
              {
                timestamp: "00:08:50",
                speaker: "Rajesh (CTO)",
                text: "Yes, exactly. Ensure we log all high-risk decisions, exceptions, and any partial PCI compliance evidence for our records. It's… important, okay?"
              },
              {
                timestamp: "00:09:15",
                speaker: "Alex (CEO)",
                text: "Noted. Partial internal audit evidence will be documented. Stripe integration gets priority. And, uh, let's try to revisit external audit in Q2 if budget allows."
              },
              {
                timestamp: "00:09:45",
                speaker: "Maria (CFO)",
                text: "Fine… but just to flag, skipping the audit increases our legal and insurance exposure. So, every decision, uh… must be logged and reviewed later."
              }
            ]
          }
        ],
        whatsapp: [
          {
            thread_id: "wa_group_001",
            name: "Executive Strategic Sync",
            is_relevant: true,
            messages: [
              {
                sender: "Maria Santos (CFO)",
                text: "Uh, Alex, we are overleveraged. $45k is the hard limit for the checkout project… I mean, anything more is risky."
              },
              {
                sender: "Alex Chen (CEO)",
                text: "Maria, I hear you. But if we don't fix the drop-offs, we could lose $100k/month. I'm thinking we push for $55k total."
              },
              {
                sender: "Rajesh Patel (CTO)",
                text: "Doing this right with PCI compliance… honestly, that's an $80k job if we want full coverage."
              },
              {
                sender: "Alex Chen (CEO)",
                text: "Hmm, okay… let's find a middle ground. $55k total, but we cut the external audit. At least temporarily."
              },
              {
                sender: "Maria Santos (CFO)",
                text: "Cutting the audit worries me. Internal scans won't protect us legally. Uh… just saying."
              },
              {
                sender: "Rajesh Patel (CTO)",
                text: "Yes, agreed. Legal exposure increases without external validation. Maybe a note in logs?"
              }
            ]
          },
          {
            thread_id: "wa_group_social",
            name: "Friday Night Football ⚽",
            is_relevant: false,
            messages: [
              {sender: "Coach Mike", text: "Who's in for the 7 PM match? Pitch 4 is booked."},
              {sender: "Alex Chen", text: "I'm in! Bringing the extra water bottles."}
            ]
          }
        ],
        slack: [
          {
            channel_id: "sl_project_dev",
            name: "#checkout-dev-ops",
            is_relevant: true,
            messages: [
              {sender: "James Liu (Senior Dev)", text: "The $15k external security audit is critical. Without it, we're flying blind on vulnerabilities."},
              {sender: "Rajesh Patel (CTO)", text: "CEO ordered a $55k cap. If we keep the audit, we lose the Stripe integration devs."},
              {sender: "James Liu (Senior Dev)", text: "Fine. We skip the audit, but I'm marking it as a 'High Risk' in the logs."}
            ]
          },
          {
            channel_id: "sl_random",
            name: "#random-and-memes",
            is_relevant: false,
            messages: [
              {sender: "Priya Sharma", text: "Has anyone seen that cat video? 🐱"}
            ]
          }
        ],
        gmail: [
          {
            thread_id: "gm_001",
            subject: "RE: Budget Realignment",
            from: "Maria Santos (CFO)",
            content: "Alex, I've moved $10k from the Marketing pool. You have $55k total. Do not ask for more.",
            is_relevant: true
          },
          {
            thread_id: "gm_002",
            subject: "Payment Compliance Reminder",
            from: "Rajesh Patel (CTO)",
            content: "Reminder: PCI compliance must be maintained. Skipping external audit increases legal & insurance risk.",
            is_relevant: true
          },
          {
            thread_id: "gm_999",
            subject: "Your Amazon.in order has shipped!",
            from: "Amazon Notifications",
            content: "Your order for 'Ergonomic Mouse Pad' is on the way.",
            is_relevant: false
          }
        ]
      }
    },

    // USER 2: Sarah Johnson - FinSafe App Launch
    {
      user_id: "test2",
      name: "Sarah Johnson",
      role: "Marketing Lead",
      project: "FinSafe App Launch",
      data_vault: {
        meetings: [
          {
            meeting_id: "mtg_marketing_sync_2024-02-06",
            title: "Marketing & Security Launch Sync",
            date: "Feb 06, 2024",
            participants: ["Sarah Johnson (Marketing Lead)", "Michael Torres (Engineering)", "David (Backend)"],
            minutes: [
              {
                timestamp: "00:04:30",
                speaker: "Sarah Johnson",
                text: "Our Friday launch is locked for investors. We need the app demo ready and secure."
              },
              {
                timestamp: "00:05:10",
                speaker: "Michael Torres",
                text: "There's a race condition in the stock ticker API. High load could crash the app."
              },
              {
                timestamp: "00:05:50",
                speaker: "Sarah Johnson",
                text: "Can we tag it as 'Beta' for the launch? Investors must see it Friday."
              },
              {
                timestamp: "00:06:20",
                speaker: "David (Backend)",
                text: "Using cached data keeps it stable, but Marketing promised 'Live' updates in ads."
              },
              {
                timestamp: "00:06:50",
                speaker: "Sarah Johnson",
                text: "I understand the risk, but launch is priority. Let's go with 'Beta' disclaimer."
              }
            ]
          }
        ],
        whatsapp: [
          {
            thread_id: "wa_fin_launch",
            name: "🚀 FinSafe Launch Squad",
            is_relevant: true,
            messages: [
              {
                sender: "Sarah Johnson",
                text: "Team, Friday launch is non-negotiable. $2M investor pitch at 4 PM."
              },
              {
                sender: "Michael Torres (Engineering)",
                text: "Sarah, race condition in stock ticker. App may crash under 1000+ users."
              },
              {
                sender: "Sarah Johnson",
                text: "Tag it 'Beta'? Can't delay investors."
              },
              {
                sender: "Michael Torres (Engineering)",
                text: "'Beta' won't fix the crash. Need 10 days to refactor."
              }
            ]
          },
          {
            thread_id: "wa_gym",
            name: "Morning Yoga 🧘‍♀️",
            is_relevant: false,
            messages: [
              {sender: "Instructor", text: "Class moved to 8 AM tomorrow!"}
            ]
          }
        ],
        slack: [
          {
            channel_id: "sl_fin_dev",
            name: "#finsafe-engineering",
            is_relevant: true,
            messages: [
              {
                sender: "Michael Torres (Engineering)",
                text: "Sarah is pushing for Friday. I've told her the API is unstable."
              },
              {
                sender: "David (Backend)",
                text: "If we switch to 'Cached Data' instead of 'Real-Time', it stays stable. But Marketing promised 'Live' data in the ads."
              },
              {
                sender: "Michael Torres (Engineering)",
                text: "Let's see if she'll compromise on 'Real-Time' for the launch. It saves the server."
              }
            ]
          }
        ],
        gmail: [
          {
            thread_id: "gm_fin_001",
            subject: "URGENT: Investor Pitch Deck Finalization",
            from: "Alex Chen (CEO)",
            content: "Sarah, I've told the VCs they can download the app LIVE during my speech this Friday. Do not let me down.",
            is_relevant: true
          },
          {
            thread_id: "gm_spam_01",
            subject: "Flash Sale: 50% off Standing Desks!",
            from: "OfficeDepot",
            content: "Click here to upgrade your workspace today!",
            is_relevant: false
          }
        ]
      }
    },

    // USER 3: Marcus Johnson - MediConnect HIPAA Portal
    {
      user_id: "test3",
      name: "Marcus Johnson",
      role: "Tech Lead",
      project: "MediConnect HIPAA Portal",
      data_vault: {
        meetings: [
          {
            meeting_id: "mtg_hipaa_sprint5_2024-02-08",
            title: "Sprint 5 Planning - HIPAA Compliance",
            date: "Feb 08, 2024",
            participants: ["Marcus Johnson (Tech Lead)", "Emma Wilson (Product Manager)", "Legal (Sarah)"],
            minutes: [
              {
                timestamp: "00:03:00",
                speaker: "Emma Wilson",
                text: "Doctors are asking for Dark Mode and mobile app in Sprint 5."
              },
              {
                timestamp: "00:03:30",
                speaker: "Marcus Johnson",
                text: "Sprint 5 is packed with HIPAA logging and encrypted file upload. Can't add more."
              },
              {
                timestamp: "00:04:00",
                speaker: "Legal (Sarah)",
                text: "If audit trails aren't live by Sprint 5 EOD, we're in violation of HIPAA agreement."
              },
              {
                timestamp: "00:04:30",
                speaker: "Marcus Johnson",
                text: "Exactly. I'm locking the scope. UI features are secondary to legal compliance."
              }
            ]
          }
        ],
        whatsapp: [
          {
            thread_id: "wa_med_dev",
            name: "🏥 MediConnect Core Team",
            is_relevant: true,
            messages: [
              {
                sender: "Emma Wilson (Product Manager)",
                text: "Marcus, doctors want Dark Mode and mobile exploration in Sprint 5."
              },
              {
                sender: "Marcus Johnson",
                text: "Emma, Sprint 5 has HIPAA logging and encrypted file upload. We can't add more."
              },
              {
                sender: "Emma Wilson (Product Manager)",
                text: "It's just UI! Stakeholders say it's a dealbreaker."
              },
              {
                sender: "Marcus Johnson",
                text: "UI changes in medical portal require accessibility testing and security review. We are at capacity."
              }
            ]
          },
          {
            thread_id: "wa_parking",
            name: "Office Parking Updates 🚗",
            is_relevant: false,
            messages: [
              {sender: "Security", text: "Gate 2 under maintenance. Use East entrance."}
            ]
          }
        ],
        slack: [
          {
            channel_id: "sl_hipaa_compliance",
            name: "#compliance-and-security",
            is_relevant: true,
            messages: [
              {
                sender: "Marcus Johnson",
                text: "Emma is trying to push Dark Mode into sprint. We haven't finished audit trails for patient data access."
              },
              {
                sender: "Legal (Sarah)",
                text: "If those audit trails aren't live by Sprint 5 EOD, we are in violation of our HIPAA agreement. UI features are secondary."
              },
              {
                sender: "Marcus Johnson",
                text: "Exactly. I'm locking the scope today."
              }
            ]
          }
        ],
        gmail: [
          {
            thread_id: "gm_med_001",
            subject: "Stakeholder Feedback - Pilot Phase",
            from: "Emma Wilson (PM)",
            content: "Marcus, the board specifically mentioned 'Modern Look and Feel' as top priority. They want Dark Mode demoed by next Tuesday. Can we swap out the file-upload backend for this?",
            is_relevant: true
          },
          {
            thread_id: "gm_hr_01",
            subject: "Mandatory Security Training: Phishing",
            from: "IT Security",
            content: "Please complete your training modules by EOD to avoid account suspension.",
            is_relevant: false
          }
        ]
      }
    },

    // USER 4: Thomas Xu - SecureStream Video Engine
    {
      user_id: "test4",
      name: "Thomas Xu",
      role: "Security Lead / CISO",
      project: "SecureStream Video Engine",
      data_vault: {
        meetings: [
          {
            meeting_id: "mtg_security_review_2024-02-10",
            title: "Video Engine Security Assessment",
            date: "Feb 10, 2024",
            participants: ["Thomas Xu (CISO)", "Alex Rodriguez (Junior Dev)", "CTO"],
            minutes: [
              {
                timestamp: "00:02:00",
                speaker: "Alex Rodriguez",
                text: "FFmpeg OpenSource v4.2.1 makes rendering 10x faster. We need it for launch."
              },
              {
                timestamp: "00:02:30",
                speaker: "Thomas Xu",
                text: "That version has two critical CVEs. We cannot use it. Use internal VideoProcessor API."
              },
              {
                timestamp: "00:03:00",
                speaker: "Alex Rodriguez",
                text: "But the internal API is so slow! Users will complain about lag."
              },
              {
                timestamp: "00:03:30",
                speaker: "Thomas Xu",
                text: "I'd rather have lag than a data breach. My decision is final."
              }
            ]
          }
        ],
        slack: [
          {
            channel_id: "sl_sec_ops",
            name: "#security-war-room",
            is_relevant: true,
            messages: [
              {
                sender: "Alex Rodriguez (Junior Dev)",
                text: "Thomas, if we use FFmpeg-OpenSource v4.2.1, the video rendering is 10x faster. We need this for the launch."
              },
              {
                sender: "Thomas Xu",
                text: "Alex, that version has two critical CVEs (vulnerabilities). We cannot use it. Use the internal VideoProcessor API."
              },
              {
                sender: "Alex Rodriguez (Junior Dev)",
                text: "But the internal API is so slow! The users will complain about the lag."
              },
              {
                sender: "Thomas Xu",
                text: "I'd rather have lag than a data breach. My decision is final."
              }
            ]
          }
        ],
        gmail: [
          {
            thread_id: "gm_sec_001",
            subject: "CVE Alert - Action Required",
            from: "CyberSecurity Monitor",
            content: "Alert: FFmpeg v4.2.1 contains a buffer overflow vulnerability (CVE-2023-4847) that allows remote code execution.",
            is_relevant: true
          }
        ]
      }
    },

    // USER 5: Diana Nguyen - SwiftDelivery Logistics Platform
    {
      user_id: "test5",
      name: "Diana Nguyen",
      role: "Operations Head",
      project: "SwiftDelivery Logistics Platform",
      data_vault: {
        meetings: [
          {
            meeting_id: "mtg_logistics_budget_2024-02-12",
            title: "Maps Vendor Selection Meeting",
            date: "Feb 12, 2024",
            participants: ["Diana Nguyen (Operations)", "Robert Zhao (Finance)", "Tech Lead"],
            minutes: [
              {
                timestamp: "00:01:30",
                speaker: "Diana Nguyen",
                text: "We need to finalize maps vendor. Google Maps is quoting $42k/year."
              },
              {
                timestamp: "00:02:00",
                speaker: "Robert Zhao",
                text: "$42k is insane. Use OpenStreetMap. It's free."
              },
              {
                timestamp: "00:02:30",
                speaker: "Diana Nguyen",
                text: "OpenStreetMap lacks real-time traffic data. Will cost us more in late deliveries."
              },
              {
                timestamp: "00:03:00",
                speaker: "Robert Zhao",
                text: "The budget is the budget. Find a way to make the free version work."
              }
            ]
          }
        ],
        whatsapp: [
          {
            thread_id: "wa_ops_logistics",
            name: "🚚 Delivery Fleet HQ",
            is_relevant: true,
            messages: [
              {
                sender: "Diana Nguyen",
                text: "We need to finalize the maps vendor. Google Maps is quoting us $42,000/year based on our volume."
              },
              {
                sender: "Robert Zhao (Finance)",
                text: "Diana, $42k is insane. Use OpenStreetMap. It's free."
              },
              {
                sender: "Diana Nguyen",
                text: "Robert, OpenStreetMap doesn't have real-time traffic data for the drivers. It will cost us more in late deliveries."
              },
              {
                sender: "Robert Zhao (Finance)",
                text: "The budget is the budget. Find a way to make the free version work."
              }
            ]
          }
        ],
        gmail: [
          {
            thread_id: "gm_ops_001",
            subject: "Google Maps Enterprise Quote",
            from: "Google Cloud Sales",
            content: "Your customized quote for the Logistics API suite is $42,000 per annum, billed monthly.",
            is_relevant: true
          }
        ]
      }
    }
  ],

  /**
   * Get user data by user_id
   * @param {string} userId - User ID
   * @returns {object|null} User data or null
   */
  getUserData(userId) {
    return this.users.find(u => u.user_id === userId) || null;
  },

  /**
   * Get all users
   * @returns {array} Array of all users
   */
  getAllUsers() {
    return this.users;
  },

  /**
   * Get user list for dropdown (id, name, project)
   * @returns {array} Simplified user list
   */
  getUserList() {
    return this.users.map(u => ({
      user_id: u.user_id,
      name: u.name,
      role: u.role,
      project: u.project
    }));
  }
};

// Make DummyData available globally
if (typeof window !== 'undefined') {
  window.DummyData = DummyData;
}
