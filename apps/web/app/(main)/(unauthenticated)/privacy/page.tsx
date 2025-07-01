import Footer from "@/components/layout/footer";
import NavMobile from "@/components/layout/nav-mobile";
import ReactMarkdown from "react-markdown";

export default function ManifestoPage() {
    return (
        <div className='mx-auto flex max-w-screen-lg flex-col gap-10 px-2 pt-6 pb-12 sm:px-6 sm:pb-16 md:px-12 md:py-16'>
            <div className='flex items-end justify-end px-4'><NavMobile /></div>
            <div className='flex flex-col gap-10 px-4'>
                <div className="flex flex-col gap-6">
                    <h1 className="font-brand text-4xl">Privacy Policy</h1>
                    <ReactMarkdown>
                        {`
**Last updated:** July 1, 2025

This privacy policy explains how D21 (available at [www.d21.so](https://www.d21.so)) collects, uses, and protects your personal data, in accordance with Regulation (EU) 2016/679 (GDPR) and applicable Italian data protection laws.

---

## 1. Data Controller

**D21**
Email: [kkratterf@gmail.com](mailto:kkratterf@gmail.com)

D21 is the Data Controller and is responsible for the use of your personal data in relation to the services offered through www.d21.so.

---

## 2. Types of Data Collected

We may collect and process the following types of data:

- **Data provided voluntarily**:
- Name, email address, and any other information you provide when submitting a startup or signing up.
- Information provided via contact or feedback forms.

- **Data collected automatically**:
- Technical data (e.g., IP address, browser type, operating system).
- Navigation data (e.g., pages visited, time spent on the site).
- Cookies and similar technologies (see section 7).

- **Public data**:
- Information about startups sourced from public databases (e.g., company registries, official websites).

---

## 3. Purpose of Data Processing

Your data may be used for the following purposes:

- To provide and improve the services offered by D21 (e.g., public startup directory).
- To enhance user experience.
- To communicate relevant updates or requests.
- To respond to inquiries and support requests.
- To perform anonymized analytics and statistics.
- To comply with legal and regulatory obligations.

---

## 4. Legal Basis for Processing

We process your data only when one of the following applies:

- You have given explicit consent (e.g., for newsletter signup or voluntary submission).
- It is necessary for the performance of a contract or pre-contractual measures.
- It is in our legitimate interest, provided it does not override your rights.
- We are legally obliged to do so.

---

## 5. Data Retention

We retain your data only for as long as necessary to fulfill the purposes for which it was collected, unless otherwise required by law or for security reasons.

---

## 6. Data Sharing

We do not sell or trade your data. Your data may be shared only with:

- Third-party service providers (e.g., hosting, email, analytics) bound by confidentiality agreements.
- Public authorities when required by law.

---

## 7. Cookies and Similar Technologies

This site may use technical cookies and, with your consent, third-party cookies (e.g., Google Analytics). For more details, see our [Cookie Policy](#).

---

## 8. Your Rights

Under the GDPR, you have the right to:

- Access your data.
- Request correction or deletion of your data.
- Restrict or object to data processing.
- Request data portability.
- Withdraw consent at any time.

To exercise your rights, contact us at: **[support@d21.so](mailto:support@d21.so)**

---

## 9. Data Security

We adopt appropriate technical and organizational measures to protect your data from unauthorized access, disclosure, loss, or destruction.

---

## 10. Changes to This Policy

We reserve the right to update this privacy policy at any time. In case of substantial changes, we will inform you via the website or email.

---`}
                    </ReactMarkdown>
                </div>
            </div>
            <Footer />
        </div>
    )
}