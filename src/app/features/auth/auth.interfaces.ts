export interface Company {
    companyID: number;
    companyName: string;
    shortName: string | null;
    crNo: string | null;
    crIssueDate: string;
    crRenewalDate: string;
    address1: string;
    address2: string | null;
    city: string | null;
    country: string | null;
    postalcode: string | null;
    phone: string;
    mobile: string | null;
    email: string;
    url: string | null;
    currencyID: number;
    accountStartingDate: string;
    useIndainVAT: string;
    applicableFrom: string;
    noofPeriods: number | null;
    startFromHijraDate: string | null;
    emblem: string | null;
    organizationID: number;
    vatNumber: string | null;
    createdBy: number;
}


