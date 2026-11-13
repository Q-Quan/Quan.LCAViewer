export type LcaMetadata = {
    projectName:               string;
    goalScopeDescription:      string;
    scenarios:                 { [key: string]: Scenario };
    yearSeparator:             string;
    defaultScenario:           string;
    defaultImpactCategories:   string[];
    defaultYears:              string[];
    defaultAlternatives:       any[];
    shortLabels:               { [key: string]: string };
    longLabels:                { [key: string]: string };
    descriptions:              { [key: string]: string };
    colors:                    { [key: string]: string };
    normalizationFactors:      { [key: string]: number };
    axisLabels:                { [key: string]: string };
    axisLimitNormalized:       number;
    axisLimitNormalizedZoomed: number;
}

export type Scenario = {
    title:    string;
    filename: string;
}