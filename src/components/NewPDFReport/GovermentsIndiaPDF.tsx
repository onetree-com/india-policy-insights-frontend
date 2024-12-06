import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";
import TextTranslation from "./TextTranslation";

const GovermentsIndiaPDF = () => {
  const texts = [
    { title: "48A: ", subtitle: "Section 498A of IPC; " },
    { title: "AABY: ", subtitle: "Aam Admi Bima Yojana; " },
    { title: "48A: ", subtitle: "Anna Antyodaya Yojana; " },
    {
      title: "ABWC: ",
      subtitle: "Ayushman Bharat Healthand and Wellness Centres; ",
    },
    { title: "ABY: ", subtitle: "Atal Bhujal Yojana; " },

    { title: "AFHC: ", subtitle: "Adolescent Friendly Health Clinics; " },
    { title: "AHS: ", subtitle: "Adolescent Health Strategy; " },
    { title: "AK: ", subtitle: "Aahaar Kranti; " },
    { title: "AMB: ", subtitle: "Anemia Mukt Bharat; " },
    {
      title: "AMRIT: ",
      subtitle: "Affordable Medicines and Reliable Implants for Treatment; ",
    },
    { title: "Amrit Sarovar: ", subtitle: "Mission Amrit Sarovar; " },
    {
      title: "AMRUT: ",
      subtitle: "Atal Mission for Rejuvenation and UrbanTransformation; ",
    },
    { title: "Antara: ", subtitle: "Antara Programme; " },
    { title: "AS: ", subtitle: "Aanganwadi Services; " },
    { title: "ATL: ", subtitle: "Atal Tinkering Labs; " },
    { title: "BBBP: ", subtitle: "Beti Bachao Beti Padhao Yojana; " },
    {
      title: "BMBP: ",
      subtitle:
        "Birth Microplanningand Birth Preparedness by Skilled birth attendance (SBA)trainedANMs; ",
    },
    { title: "BPKK: ", subtitle: "Bhartiya Poshan Krishi Kosh; " },
    { title: "Chayya: ", subtitle: "Mala-N: Chhaya and Mala-Ntablets; " },
    {
      title: "COTPA: ",
      subtitle:
        "The Cigarettes and Other Tobacco Products (Prohibition of Advertisement and Regulation of Trade and Commerce, Production, Supply and Distribution) Act, 2003; ",
    },
    { title: "DDUGJY: ", subtitle: "Deendayal Upadhyaya Gram Jyoti Yojana; " },
    {
      title: "DGAG: ",
      subtitle: "Digital Gender Atlasfor Advancing Girls Education;",
    },
    {
      title: "DIKSHA: ",
      subtitle: "Digital Infrastructure for Knowledge Sharing; ",
    },
    { title: "DPA: ", subtitle: "Dowry Prohibition Act; " },
    { title: "eAushidhi: ", subtitle: "Electronic Aushidhi; " },
    { title: "ECS: ", subtitle: "Enhanced Compensation Scheme; " },
    { title: "ERA: ", subtitle: "Equal Remuneration Act; " },
    {
      title: "ESB: ",
      subtitle: "Ensuring Spacing at Birth incentive to ASHA; ",
    },
    { title: "Fortification: ", subtitle: "Food Fortification; " },
    { title: "FPIS: ", subtitle: "Family Planning Indemnity Scheme; " },
    { title: "GEC: ", subtitle: "Green Energy Corridors; " },
    { title: "HBNC: ", subtitle: "Home-Based Newborn Care; " },
    { title: "HDC: ", subtitle: "Home Delivery of Contraceptives Scheme; " },
    {
      title: "HIHC: ",
      subtitle: "High Impact Hypertension Control Initiative; ",
    },
    { title: "ICDS: ", subtitle: "Integrated Child Development Services; " },
    {
      title: "ICDS-ANM: ",
      subtitle:
        "Integrated Child Development Services (AuxiliaryNurseMidwife); ",
    },
    { title: "IDCF: ", subtitle: "Intensified Diarrhoea ControlFortnight; " },
    { title: "IHIP: ", subtitle: "Integrated Health Information Platform; " },
    { title: "IMI: ", subtitle: "Intensified Mission Indradhanush; " },
    {
      title: "IMNCI: ",
      subtitle: "Integrated Management of Neonataland Childhood Illnesses; ",
    },
    { title: "IPDS: ", subtitle: "Integrated Power Development Scheme; " },
    {
      title: "IRCA: ",
      subtitle: "Integrated Rehabilitation Centre for Addicts; ",
    },
    { title: "Jaldoot: ", subtitle: "Jaldoot App; " },
    { title: "JJM: ", subtitle: "Jal Jeevan Mission; " },
    {
      title: "JNNURM: ",
      subtitle: "Jawaharlal Nehru National Urban Renewal Mission; ",
    },
    { title: "JSSK: ", subtitle: "Janani Shishu Suraksha Karyakram; " },
    { title: "JSY: ", subtitle: "Janani Suraksha Yojana; " },
    { title: "KGBV: ", subtitle: "Kasturba Gandhi Balika Vidyalaya; " },
    {
      title: "KUSUM: ",
      subtitle: "Pradhan Mantri Kisan Urja Surakshaevam Utthan Mahabhiyan; ",
    },
    { title: "LMC: ", subtitle: "Lactation Management Centers; " },
    {
      title: "LQI: ",
      subtitle: "Labour Room Quality Improvement Initiative; ",
    },
    { title: "MAA: ", subtitle: "Mothers Absolute Affection; " },
    { title: "MBA: ", subtitle: "Maternity Benefits Act; " },
    { title: "MCC: ", subtitle: "Motherand Child card; " },
    { title: "MDSR: ", subtitle: "Maternal Death Surveillance and Response; " },
    {
      title: "MGNREGA: ",
      subtitle: "Mahatma Gandhi National Rural Employment Guarantee Act; ",
    },
    {
      title: "MPLADS: ",
      subtitle: "Member of Parliament Local Area Development Scheme; ",
    },
    { title: "MPV: ", subtitle: "Mission Parivar Vikas; " },
    { title: "MTP: ", subtitle: "Medical Termination of Pregnancy Act; " },
    { title: "Mudra: ", subtitle: "Pradhan Mantri Mudra Yojana; " },
    { title: "MWA: ", subtitle: "Minimum Wages Act; " },
    {
      title: "NAP: ",
      subtitle: "National Nutritional Anaemia Prophylaxis Programme; ",
    },
    { title: "NBM: ", subtitle: "National Biomonitoring Program; " },
    { title: "NEP: ", subtitle: "National Education Policy; " },
    { title: "NFSA: ", subtitle: "National Food Security Act; " },
    { title: "NHM: ", subtitle: "National Health Mission; " },
    {
      title: "NIDDCP: ",
      subtitle: "National Iodine Deficiency Disorders Control Programme; ",
    },
    { title: "NILP: ", subtitle: "NewIndia Literacy Program; " },
    {
      title: "NPCDCS: ",
      subtitle:
        "National Programme for Prevention and Control of Cancer, Diabetes , Cardiovascular Disease and Stroke; ",
    },
    { title: "NPP: ", subtitle: "National Population Policy; " },
    { title: "NRC: ", subtitle: "Nutrition Rehabilitation Centers; " },
    { title: "NRHM: ", subtitle: "National Rural Health Mission; " },
    { title: "NSIG: ", subtitle: "National Scheme for Incentives to Girls; " },
    { title: "NSM: ", subtitle: "National Solar Mission; " },
    { title: "NSSK: ", subtitle: "National Healt hMission; " },
    { title: "NSU: ", subtitle: "Newborn Care Corners; " },
    { title: "NSV: ", subtitle: "No Scalpel Vasectomy; " },
    { title: "NTCP: ", subtitle: "National Tobacco Control Program; " },
    {
      title: "NTEP: ",
      subtitle: "National Tuberculosis Elimination Programme; ",
    },
    {
      title: "NVAPP: ",
      subtitle: "National Vitamin A Prophylaxis Programme; ",
    },
    {
      title: "PCM: ",
      subtitle: "TheProhibitionofChildMarriage (Amendment), 2006 and 2022; ",
    },
    {
      title: "PEC: ",
      subtitle:
        "The Prohibition of Electronic  Cigarettes (Production, Manufacture ,Import ,Export ,Transport ,Sale ,Distribution ,Storage and Advertisement)Act ,2019; ",
    },
    { title: "PEP: ", subtitle: "Peer Educator Programme; " },
    { title: "PMAY-G:: ", subtitle: "Pradhan Mantri Awaas Yojana (Grameen); " },
    {
      title: "PMAY-U: ",
      subtitle: "Pradhan Mantri Awas Yojana—Housing for All (Urban); ",
    },
    { title: "PMGKY: ", subtitle: "PradhanMantriGaribKalyan Yojana; " },
    { title: "PMJAY: ", subtitle: "Pradhan Mantri Jan Arogya Yojana; " },
    { title: "PMMVY: ", subtitle: "Pradhan Mantri Matru Vandana Yojana; " },
    { title: "PMRPA: ", subtitle: "Pradhan Mantri Rojgar Protsahan Yojana; " },
    { title: "PMRPY: ", subtitle: "Pradhan Mantri Suraksha Bima Yojana; " },
    {
      title: "PMSBY: ",
      subtitle: "Pradhan Mantri Surakshit Matritva Abhiyan; ",
    },
    { title: "PMSSY: ", subtitle: "Pradhan Mantri Swasthya Suraksha Yojana; " },
    {
      title: "PMSYMDY: ",
      subtitle: "Pradhan Mantri Shram YogiMaan-DhanYojana; ",
    },
    { title: "PMUY: ", subtitle: "Pradhan Mantri Ujjwala Yojana; " },
    {
      title: "POCSO: ",
      subtitle: "Protection of Children from Sexual Offences Act; ",
    },
    {
      title: "POSHAN: ",
      subtitle: "Prime Minister's Overarching Scheme for Holistic Nutrition; ",
    },
    { title: "PPP: ", subtitle: "Pulse Polio Programme; " },
    {
      title: "PSHWP: ",
      subtitle:
        "The Prohibition of Sexual Harassment of Women at Workplace Act; ",
    },
    {
      title: "PWDVA: ",
      subtitle: "Protection of Women against Domestic Violence Act; ",
    },
    { title: "RAA: ", subtitle: "Rashtriya Avishkar Abhiyan; " },
    { title: "RBDA: ", subtitle: "Registration of Births and Deaths Act; " },
    { title: "RBSK: ", subtitle: "Rashtriya Bal Swasthya Karyakram; " },
    {
      title: "RM-ARI: ",
      subtitle:
        "Reduction inmorbidity and mortality due to Acute Respiratory Infections; ",
    },
    { title: "Rozgar Mela: ", subtitle: "Employment Fair; " },
    {
      title: "RPF-PPIUCD: ",
      subtitle: "Revitalizing Post partum Family Planning including PPIUCD; ",
    },
    {
      title: "RTE: ",
      subtitle: "Right of Children to Freeand CompulsoryEducation; ",
    },
    { title: "RUSA: ", subtitle: "Rashtriya Uchchatar Shiksha Abhiyan; " },
    { title: "SA: ", subtitle: "Saksham Anganwadi; " },
    {
      title: "SANPS: ",
      subtitle:
        "Social Awareness and Actions to Neutralize Pneumonia Successfully; ",
    },
    {
      title: "Saubhagya: ",
      subtitle: "Pradhan Mantri Sahaj Bijli Har Ghar Yojana; ",
    },
    { title: "SBM: ", subtitle: "Swachh Bharat Mission; " },
    { title: "SBM-G: ", subtitle: "Swachh Bharat Mission (Grameen); " },
    { title: "SCM: ", subtitle: "Smart Cities Mission; " },
    { title: "SMA: ", subtitle: "Surakshit Matritva Aashwasan; " },
    { title: "SMB: ", subtitle: "Safe Motherhood Booklets; " },
    { title: "SN: ", subtitle: "Supplementary Nutrition Programme; " },
    { title: "SNP: ", subtitle: "Special Nutrition Program; " },
    {
      title: "SPMH: ",
      subtitle:
        "Scheme for Promotion of Menstrual Hygiene among Adolescent Girls; ",
    },
    { title: "SSA: ", subtitle: "Samagra Shiksha Abhiyan; " },
    { title: "Svavlamban: ", subtitle: "Svavlamban Scheme; " },
    {
      title: "SVPSG: ",
      subtitle: "Swami Vivekananda Policy for Single Girl Child; ",
    },
    {
      title: "SWAYAM: ",
      subtitle: "Study Webs of Active-Learning for Young Aspiring Minds; ",
    },
    { title: "TBSY: ", subtitle: "Thalassemia Bal Sewa Yojna; " },
    { title: "TPDS: ", subtitle: "Targeted Public Distribution System; " },
    {
      title: "Ujjwala-DISCOM: ",
      subtitle: "Ujjwala DISCOM Assurance Yojana; ",
    },
    { title: "WBNP: ", subtitle: "Wheat Based Nutrition Program; " },
    { title: "WHS: ", subtitle: "Women Helpline Scheme; " },
    {
      title: "WIFSP: ",
      subtitle: "Weekly Iron Folic Acid Supplementation Programme; ",
    },
    {
      title: "WISTS: ",
      subtitle: "Waiver of Inter State Transmissio nSystem Charges; ",
    },
    { title: "YUVA: ", subtitle: "PM-YUVA Yojana; " },
  ];

  return (
    <View style={styles.container}>
      <Text>
        <TextTranslation
          style={styles.title}
          tkey="government_of_india_programs"
        />{" "}
        {texts.map((text, key) => (
          <React.Fragment key={key}>
            <Text style={styles.textTitle}>{text.title}</Text>
            <Text style={styles.text}>{text.subtitle}</Text>
          </React.Fragment>
        ))}
      </Text>
    </View>
  );
};
export default GovermentsIndiaPDF;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    paddingBottom: 10,
    borderBottom: "1px solid #BCBCBC",
    alignItems: "center",
  },
  text: {
    color: "#858585",
    fontSize: "7pt",
    fontWeight: 400,
    fontFamily: "Helvetica",
    fontStyle: "normal",
  },
  textTitle: {
    color: "#C87981",
    fontSize: "7pt",
    fontWeight: 400,
    fontFamily: "Helvetica",
    fontStyle: "normal",
  },
  title: {
    color: "#A92D38",
    fontSize: "10pt",
    fontWeight: 600,
    fontFamily: "Helvetica-Bold",
    fontStyle: "normal",
  },
});
