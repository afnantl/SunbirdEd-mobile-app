import { FormAndFrameworkUtilService } from '@app/services';

import { FiltersPage } from './filters.page';
import { ContentService } from '@project-sunbird/sunbird-sdk';
import { Platform, PopoverController } from '@ionic/angular';
import { Events } from '@app/util/events';
import {
    CommonUtilService,
    TelemetryGeneratorService,
    AppHeaderService
} from '../../../services';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { mockSupportedUserTypeConfig } from '../../../services/profile-handler.spec.data';
import { mockFilterCriteria } from './filters.page.spec.data';
describe('FiltersPage', () => {
    let filtersPage: FiltersPage;

    const mockContentService: Partial<ContentService> = {
        searchContent: jest.fn(() => of({ filterCriteria: mockFilterCriteria } as any))
    };

    const mockPopOverConroller: Partial<PopoverController> = {};
    const mockEvents: Partial<Events> = {};
    const mockCommonUtilService: Partial<CommonUtilService> = {
        getLoader: jest.fn(() => {
            return {
                present: jest.fn(),
                dismiss: jest.fn()
            };
        }),
        showToast: jest.fn(),
        translateMessage: jest.fn(() => ('translated_message')),
        deDupe: jest.fn((array, property) => {
            return array.filter((obj, pos, arr) => {
                return arr.map(mapObj => mapObj[property]).indexOf(obj[property]) === pos;
            });
        })
    };
    const mockPlatform: Partial<Platform> = {
    };
    mockPlatform.backButton = {
        subscribeWithPriority: jest.fn((_, fn) => fn()),

    } as any;

    const mockLocation: Partial<Location> = {
        back: jest.fn()
    };

    const mockRouter: Partial<Router> = {
        getCurrentNavigation: jest.fn(() => ({
            extras: {
                state: {
                    filterCriteria: mockFilterCriteria,
                    initialfilterCriteria: mockFilterCriteria,
                    source: 'library',
                    supportedUserTypesConfig: mockSupportedUserTypeConfig
                }
            }
        })) as any
    };
    const mockAppHeaderService: Partial<AppHeaderService> = {
    };

    const mockTelemetryGeneratorService: Partial<TelemetryGeneratorService> = {
        generateImpressionTelemetry: jest.fn(),
        generateBackClickedTelemetry: jest.fn(),
        generateInteractTelemetry: jest.fn()
    };

    const mockFormAndFrameworkUtilService: Partial<FormAndFrameworkUtilService> = {};


    beforeAll(() => {
        filtersPage = new FiltersPage(
            mockContentService as ContentService,
            mockPopOverConroller as PopoverController,
            mockEvents as Events,
            mockCommonUtilService as CommonUtilService,
            mockPlatform as Platform,
            mockLocation as Location,
            mockRouter as Router,
            mockAppHeaderService as AppHeaderService,
            mockTelemetryGeneratorService as TelemetryGeneratorService,
            mockFormAndFrameworkUtilService as FormAndFrameworkUtilService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a instance of FiltersPage', () => {
        expect(filtersPage).toBeTruthy();
    });

    describe('applyInterimFilter', () => {
        it('should invoke searchContent API', (done) => {
            // arrange
            mockFormAndFrameworkUtilService.changeChannelNameToId = jest.fn(() => {
                return {
                    primaryCategories: [],
                    sortCriteria: [],
                    mode: 'hard',
                    facetFilters: [
                      {
                        name: 'channel',
                        values: [
                          {
                            name: '0129909224683274240',
                            count: 3,
                            apply: false,
                            rootOrgId: '0129909224683274240'
                          }
                        ],
                        translatedName: 'Publisher'
                      }
                    ],
                    impliedFiltersMap: [
                      {
                        contentType: []
                      },
                      {
                        language: []
                      },
                      {
                        topic: []
                      },
                      {
                        purpose: []
                      }
                    ],
                    impliedFilters: [
                      {
                        name: 'objectType',
                        values: [
                          {
                            name: 'Content',
                            apply: true
                          },
                          {
                            name: 'QuestionSet',
                            apply: true
                          }
                        ]
                      }
                    ],
                    searchType: 'filter',
                    fields: []
                  }
            });
            // act
            filtersPage.applyInterimFilter().then(() => {
                // assert
                expect(mockContentService.searchContent).toHaveBeenCalled();
                done();
            });

        });
    });
});
