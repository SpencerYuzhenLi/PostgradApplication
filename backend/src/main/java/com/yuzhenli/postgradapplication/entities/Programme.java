package com.yuzhenli.postgradapplication.entities;

import com.yuzhenli.postgradapplication.enums.Status;
import com.yuzhenli.postgradapplication.enums.Country;
import com.yuzhenli.postgradapplication.enums.Degree;
import com.yuzhenli.postgradapplication.enums.Region;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "programmes")
public class Programme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "programme_short_name", nullable = false)
    private String programmeShortName;


    @Column(name = "institution_name")
    private String institutionName;

    @Column(name = "programme_name")
    private String programmeName;


    @Enumerated(EnumType.STRING)
    @Column(name = "region")
    private Region region;

    @Enumerated(EnumType.STRING)
    @Column(name = "country")
    private Country country;


    @Column(name = "qs_ranking")
    private Integer qsRanking;

    @Column(name = "us_news_ranking")
    private Integer usNewsRanking;

    @Column(name = "the_ranking")
    private Integer theRanking;

    @Column(name = "arwu_ranking")
    private Integer arwuRanking;


    @Enumerated(EnumType.STRING)
    @Column(name = "degree")
    private Degree degree;


    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;


    @Column(name = "application_opens")
    private LocalDate applicationOpens;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Column(name = "reference_deadline")
    private LocalDate referenceDeadline;

    @Column(name = "application_portal_url")
    private String applicationPortalUrl;



    @Column(name = "programme_length")
    private String programmeLength;


    @Column(name = "ielts_submission")
    private String ieltsSubmission;

    @Column(name = "gre_math_requirement")
    private String greMathRequirement;

    @Column(name = "institution_ets_code")
    private String institutionEtsCode;

    @Column(name = "departmental_ets_code")
    private String departmentalEtsCode;


    @Column(name = "reference_count")
    private Integer referenceCount;

    @ManyToMany
    @JoinTable(
            name = "programme_referees",
            joinColumns = @JoinColumn(
                    name = "programme_id"
            ),
            inverseJoinColumns = @JoinColumn(
                    name = "referee_id"
            )
    )
    @Builder.Default
    private Set<Referee> referees = new HashSet<>();

    @Column(name = "reference_submission")
    private String referenceSubmission;

    @Column(name = "information_for_referees_url")
    private String informationForRefereesUrl;

    @Column(name = "referee_notes")
    private String refereeNotes;


    @Column(name = "application_fee")
    private String applicationFee;

    @Column(name = "annual_tuition")
    private String annualTuition;

    @Column(name = "funding_available")
    private Boolean fundingAvailable;

    @Column(name = "funding_guaranteed")
    private Boolean fundingGuaranteed;


    @OneToMany(
            mappedBy = "programme",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC, id ASC")
    @Builder.Default
    private List<ProgrammeLink> links = new ArrayList<>();


    @Column(name = "notes")
    private String notes;
}
